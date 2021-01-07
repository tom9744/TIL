# Relations 

하나의 *Collection*에서 *Document*를 저장하고, 읽고, 수정하고, 마지막으로 삭제하는 방법을 알아보았다.  

이번에는 앞에서 작성한 *Product Model*을 확장하여 사용자의 장바구니에 추가하는 상황을 가정하고  
종속성이 존재하는 상황에서 한 개 이상의 *Collection*을 다루는 방법에 대해 알아본다.   


## Getting Prepared

실제 사용자 인증 과정은 여기서 다루지 않지만, *Relation*을 다루는 방법을 연습하기 위해  
새로운 ***User Model***을 *Collection*에 추가하며, 다음과 같이 생성할 수 있다.

```
// model/user.js

const mongodb = require('mongodb');
const getDatabase = require('util/database.js');

class User {
    constuctor(username, email) {
        this.username = username;
        this.email = email
    }

    save() {
        const database = getDatabase();
        return database.collection('users').insertOne(this);
    }

    static findById(userId) {
        const database = getDatabase();
        return database.collection('users')
            .findOne({ _id: new mongodb.ObjectId(userId) })
            .then(user => {
                return user;
            })
            .catch(error => console.log(error));
    }
}
```

위와 같은 *User Model*을 정의한 후, 사용자가 한 명 추가되었다고 가정한 뒤 진행한다.  

먼저 *Express Project*의 최상위 *Module*인 `app.js` 파일에서 다음과 같은 코드를 통해  
모든 *Request*에 `user` 속성을 추가하도록 미들웨어를 추가한다.

```
const User = require('model/user.js');

app.use((req, res, next) => {
    User.findById('<User Id>')
        .then(user => {
            req.user = user;  // User 속성 추가
            next();
        })
        .catch(error => console.log(error));
})
```

## Creating Cart

사용자가 장바구니에 추가한 목록에 포함되는 *Product Model*은 그 개수에 제한이 없지만,  
장바구니는 **사용자 한 명 당 하나만 존재할 수 있으므로 일대일 관계**를 가지고 있다.   

MongoDB에서 이러한 **일대일 관계**는 *Embeded Document*로 설계하는 것이 효율적이며,  
장바구니에 추가된 제품의 목록은 변하지만 장바구니 자체에 대한 수정 소요는 크지 않기 때문이다. 

위에서 설명한 사용자와 장바구니의 *1 on 1 Relation*을 *Embedded Document* 형식으로 구현하기 위해  
다음의 코드와 같이 앞에서 작성한 *User Model*을 수정한다. 

```
// model/user.js

const mongodb = require('mongodb');
const getDatabase = require('util/database.js');

class User {
    constuctor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id; 
    }

    /* 생략 */

    addToCard(product) {
        const updatedCart = { items: [{ ...product, qauntity: 1 }] };
        const database = getDatabase();

        return database
            .collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this. _id) },
                { $set: { cart: updatedCart} }  // Merge(X), Replace(O)
            )
    }
}
```

추가적으로 위에 작성한 *User Model*을 사용하는 `app.js` 파일에서 일부 수정이 필요하다.  

`User.findById('<User Id>')`를 통해 데이터베이스에서 반환된 결과는 *순수한 데이터*이므로  
`req.user = user;`와 같이 `req.user`에 바로 저장하게 되면 *User Model*에 선언된 메서드를 사용할 수 없다.

따라서, 반환된 결과인 `user`로 새로운 `new User()`과 같이 *User Instance*를 생성해 저장해야 한다.

```
// app.js
const User = require('model/user.js');

app.use((req, res, next) => {
    User.findById('<User Id>')
        .then(user => {
            req.user = new User(
                user.name, 
                user.email, 
                user.cart, 
                user._id
            );
            next();
        })
        .catch(error => console.log(error));
})
```

## Adding Products to Cart

이제 최종적으로 *Product Model*을 장바구니에 추가하는 기능을 구현하기 위해, *Contoller*에 아래의 코드를 추가해야 한다.

```
// controllers/user.js

const Product = require('models/product.js');

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;

    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product);  // Returns Promise
        })
        .then(result => {
            console.log(result);
        })
}
```

위의 코드는 정상적으로 *Product Model*의 값을 *User Model*의 *Cart Field*에 추가하기는 하지만,  
**중복된 데이터를 가지게 된다는 점에서 추후에 수정이 필요한 경우 문제가 발생할 가능성이 농후**하다.

예를 들어, 사용자가 장바구니에 저장해놓은 물품의 가격이 변경되는 경우,  
*User Model*에서 *Product Model*에 대한 **참조를 가지는 것이 아니라 복제된 데이터**를 가지기 때문에 변경사항이 반영되지 못한다.

즉, 사용자와 장바구니와 같은 **일대일 관계**의 경우 *Embedded Document* 방식으로 구현하는 것이 좋지만,  
장바구니와 물품과 같은 **일대다 관계**에서는 **참조를 저장하는 *Reference* 방식을 사용하는 것이 보다 바람직** 할 것이다.

장바구니에 물품을 추가할 때, 물품의 전체 정보를 저장하는 것이 아니라 물품의 ID만 저정하도록  
`models/user.js` 파일의 `addToCard()` 메서드를 다음과 같이 수정한다.   

```
addToCard(product) {
    const updatedCart = { 
        items: [{ 
            productId: new mongodb.ObjectId(product._id), 
            qauntity: 1 
        }] 
    };
    const database = getDatabase();

    return database
        .collection('users')
        .updateOne(
            { _id: new mongodb.ObjectId(this. _id) },
            { $set: { cart: updatedCart} }  // Merge(X), Replace(O)
        )
}
```


## Embedded Document vs. Reference

*Embedded Document* 방식으로 서로 다른 *Collection* 사이의 종속을 표현하면 데이터를 읽어오는 과정에서  
별도의 추가적인 질의(Query)를 사용하지 않고 단 한번의 질의로 끝나기 때문에 그 속도가 굉장히 빠르다는 장점이 있다.

*Embedded Document* 방식은 데이터를 수정하는 과정에서 크나큰 단점이 존재하는데,    
다수의 중복된 데이터에 수정사항을 반영하려면 중복 데이터를 포함하는 모든 *Document*를 직접 찾아 수정해야 한다는 것이다.


반대로 *Reference* 방식은 기존의 관계형 데이터베이스에서 종속을 표현하는 방법을 그대로 사용한다.  
즉, 종속성이 존재하는 데이터의 참조를 저장하고 실제 데이터는 저장하지 않는 것이다. 

이렇게 하면 데이터를 읽어오는 과정에서 *ID*와 같은 참조값을 사용해 또 다른 질의를 보내야 하기 때문에  
연관된 데이터의 수가 많을 수록 데이터를 읽어오는데 많은 시간이 소요된다.

하지만 실제 데이터가 아닌 참조만을 저장하므로, 원본 데이터 하나만 수정하면 그 데이터를 참조하고 있는  
모든 *Document*에 그 수정사항이 즉시 반영된다는 것은 엄청난 장점으로 작용한다.

결론적으로, 데이터의 특성과 비즈니스 요구에 따라 *Embedded Document* 방식과 *Reference* 방식 중  
어떠한 방식으로 종속을 표현할 것인지 현명하게 선택하는 능력이 필요하다.


## Adding Multiple Products to Cart

마지막으로 장바구니에 다수의 물품을 추가하고, 그 물품이 이미 존재하는 경우에는  
새롭게 물품을 추가하지 않고 해당 물품의 수량만 조절하도록 코드를 변경한다. 

```
// model/user.js

const mongodb = require('mongodb');
const getDatabase = require('util/database.js');

class User {
    constuctor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id; 
    }
        
    addToCard(product) {
        let newQuantity = 1;

        // 조건을 만족하는 첫번째 값의 인덱스를 반환, 없는 경우 -1을 반환
        const productIndex = this.cart.items.findIndex(item => {
            return item.productId.toString() === product._id.toString();
        })

        const updatedCartItems = [...this.cart.items];
        
        // 물품이 이미 장바구니에 존재하는 경우
        if (productIndex >= 0) {
            newQuantity = this.cart.items[productIndex].quantity + 1;
            updatedCartItems[productIndex].quantity = newQuantity;
        }
        // 새로운 물품이 추가되는 경우
        else {
            updatedCartItems.push({
                productId: new mongodb.ObjectId(product._id), 
                qauntity: newQuantity
            });
        }

        const updatedCart = { items: updatedCartItems };
        const database = getDatabase();

        return database
            .collection('users')
            .updateOne(
                { _id: new mongodb.ObjectId(this. _id) },
                { $set: { cart: updatedCart} }  // Merge(X), Replace(O)
            )
    }
}
```


## Displaying Cart Items

*Reference* 방식을 이용해 장바구니에 물품의 참조만을 저장하고 있기 때문에,  
단순히 장바구니에 추가된 물품의 내역을 사용자에게 전달하면 각 물품의 *ID* 밖에 확인할 수 없다. 

따라서 사용자에게 장바구니에 추가된 물품에 대한 자세한 정보까지 포함하여 전달하기 위해서는  
해당 참조값을 이용해 *Collection*에서 물품을 찾고, 최종적으로 *Response*에 추가해야 한다.

```
// model/user.js

const mongodb = require('mongodb');
const getDatabase = require('util/database.js');

class User {

    /* 생략 */

    getCart() {
        const database = getDatabase();
        const productIds = this.cart.items.map(item => {
            return item.productId;
        });

        return database
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                return products.map(product => {
                    return {
                        ...product,
                        quantity: this.cart.items.find(item => {
                            return item.productId.toString() === product._id.toString();
                        }).quantity
                    };
                });
            });
    }
}
```

위의 코드에서 먼저 주목해야할 부분은 `.find({ _id: { $in: productIds } })`이다.  

장바구니에 추가되어 있는 모든 품목의 정보를 얻기 위해서는 각각의 품목에 해당하는 *ID*를 이용해  
*Product Collection*에서 해당 물품의 정보를 가져와야 한다.

여기서 MongoDB에서 지원하는 특수한 *Query Syntax*인 `$in`을 사용하면 `find()` 메서드의 호출을 반복하지 않고  
손쉽게 모든 물품의 *ID*를 이용해 *Product Collection*에서 정보를 가져올 수 있다.

[참고] `.find({ _id: { $in: productIds } })`에서 `$in`의 *value*로 전달하고 있는 것은 물품의 *ID*를 담고 있는 배열이다.


다음으로 `this.cart.items.map(item => { return item.productId; });` 부분에서 사용된 `map()` 메서드는  
자바스크립트 내장 기능이며, 배열의 모든 원소에 대해 *Callback*을 실행한 결과를 새로운 배열에 담아 반환한다.

즉, 위의 코드에서는 배열의 원소에서 `productId` 속성만을 추출해 새로운 배열을 만들고 있는 것이다.

마지막으로 아래의 부분이 다소 헷갈릴 수 있어, 자세하게 짚고 넘어가겠다.

```
.....
.toArray()
.then(products => {
    return products.map(product => {
        return {
            ...product,
            quantity: this.cart.items.find(item => {
                return item.productId.toString() === product._toString();
            }).quantity
        };
    });
});
```

우선 `.toArray()` 메서드의 호출 결과로 반환된 배열 `products`에 대해 `then()` 메서드가 실행된다.  

마찬가지로 `map()` 메서드를 사용해 `products` 배열의 각 원소에 대해 다음 코드를 실행한 결과를 새로운 배열에 담는다.

```
return {
    ...product,
    quantity: this.cart.items.find(item => {
        return item.productId.toString() === product._id.toString();
    }).quantity
};
```

자바스크립트 내장 함수 `find()`는 배열의 각 원소에 대해 주어진 *판별 함수*를 실행하고,  
그 *판별 함수*를 만족하는 첫번째 요소의 값을 반환한다. 그런 요소가 없다면 `undefined`를 반환한다.

즉, 위의 함수는 데이터베이스에서 가져온 물품 정보를 담고 있는 배열에서 각 원소를 꺼내고,  
각 원소의 정보를 *Spread Operator*를 상용해 추출하고, **장바구니에 저장되어 있는 수량 정보**를 추가하는 것이다.