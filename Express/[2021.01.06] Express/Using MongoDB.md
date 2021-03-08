# Using MongoDB

## MongoDB Driver 

로컬 환경에 설치된 MongoDB 또는 MongoDB Atlas에 연결하기 위해서는 *MongoDB Driver*가 필요하다.  

```
npm install --save mongodb
```

*MongoDB Driver* 설치 후, 다음과 같은 코드를 작성하면 MongoDB에 연결할 수 있다.

```
// util/database.js

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const connectMongo = callback => {
    MongoClient.connect('<Database URL>')
        .then(client => {
            console.log('Connected to MongoDB!');
            callback(client);
        })
        .catch(error => {
            console.log(error);
        });
};

modules.exports = connectMongo;
```

`MongoClient.connect()` 메서드는 데이터베이스의 URL을 매개변수로 받고 *Promise*를 반환하며, `resolve()` 되는 경우 *Client* 객체를 전달한다.  

```
// app.js

const connectMongo = require('../util/database.js');

connectMongo(() => {
    app.listen(3000);
    console.log('The Server is listening on port 3000');
})
```

하지만 위와 같은 방법으로는 **데이터베이스 연결이 필요할 때마다 새롭게 연결을 생성**하기 때문에 사용하기 다소 번거롭다.  
따라서 `util/database.js` 파일에 데이터베이스 연결을 저장하는 변수를 새롭게 선언하여 사용하면, 한번 생성한 연결을 계속 유지할 수 있다.

```
// util/database.js

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _database;

const connectMongo = callback => {
    MongoClient.connect('<Database URL>')
        .then(client => {
            console.log('Connected to MongoDB!');
            _database = client.db('<Database Name>');  // Store a connection to DB
            callback();
        })
        .catch(error => {
            console.log(error);
        });
};

const getDatabase = () => {
    // When the database connection exists
    if (_database) {
        return _database;
    }

    throw 'No Database Connection Found!';
}

exports.connectMongo = connectMongo;
exports.getDatabase= getDatabase;
```

위와 같이 한번 **생성된 데이터베이스 연결을 변수에 저장해 보관하고 *Getter* 메서드를 통해 접근**할 수 있도록 하면,  
동시에 발생하는 다수의 데이터베이스 연결 요청을 효율적으로 처리할 수 있게 된다. 


## Saving Data to MongoDB

MongoDB에 연결해 데이터를 저장하는 방법을 알아보기 위해, 다음과 같은 *Data Model*을 정의한다.  

```
// models/product.js

const getDatabase = require('util/database.js').getDatabase;

class Product {
    constructor(title, price) {
        this.title = title;
        this.price = price;
    }

    save() {
        const database = getDatabase();

        return database.collection('products')  // Select a collection to work with
            .insertOne(this)  // Product's Instance 
            .then(result => console.log(result))
            .catch(error => console.log(error));
    }
}

module.exports = Product;
```

가장 먼저 `database.collection()` 메서드를 사용해 작업을 수행할 *Collection*을 선택하는데,  
매개변수로 주어진 이름의 *Collection*이 *Database*에 존재하지 않으면 자동으로 생성된다.

이후, `insertOne()` 또는 `insertMany()` 매서드를 이용해 *Document*를 추가할 수 있으며,  
`insertOne()`은 매개변수로 *Javascript Object*를, `insertMany()`는 *Javascript Object Array*를 받는다.  
MongoDB는 전달된 *Javascript Object*를 내부에서 *JSON*으로 변경하고, 데이터베이스에 저장한다.

**[중요]** *Docuemnt*의 `_id`를 지정하지 않으면, MongoDB에서 자동으로 생성된 값으로 지정된다.

다음으로, 위에서 정의한 *Data Model*을 사용하기 위한 *Controller*를 작성해야 한다.

```
// controllers/product.js

const Product = require('models/product.js');

exports.createProduct = (req, res, next) => {
    const title = req.body.titie;
    const price = req.body.price;

    const product = new Product(title, price);

    product.save().then().catch();
}
```

## Fetching All Data from MongoDB

MongoDB에 연결해 데이터를 저장하는 방법을 알아보았으니, 데이터를 가져오는 방법을 알아본다.  
데이터를 가져오는기 위해서는 *Data Model*에 인스턴스 생성없이 호출할 수 있는 `static` 메서드를 정의해야 한다.

```
// models/product.js

const getDatabase = require('util/database.js').getDatabase;

class Product {

    /* 생략 */

    static fetchAll() {
        const database = getDatabase();

        return database.collection('products')
            .find()  // Get Cursor Object
            .toArray()  // Convert to Array
            .then(products => {
                return products;
            })
            .catch(error => console.log(error));
    }
}

module.exports = Product;
```

선택된 *Collection*에서 데이터를 가져오는 `find()` 메서드는 아무런 매개변수가 전달되지 않으면  
*Collection*에 저장된 모든 *Document*를 반환한다. 특정한 조건에 해당하는 *Document*를 가져오기 위해서는  
`find()` 메서드에 특정한 조건을 정의하는 *Option Object*를 전달해 *filtering* 기능을 활성화할 수 있다.

여기서 중요한 것은 `find()` 메서드는 ***Promise*를 즉시 반환하지 않고, MongoDB에 의해 제공되는 *Cursor Object*를 반환**한다는 것인데,  
이는 *Collection*에 수많은 *Document*가 저장되어 있을 수 있기 때문이다. 따라서 MongoDB는 즉시 모든 *Document*를 반환하는 대신,  
*Document*를 하나씩 검토할 수 있도록 *Cursor Object*를 반환하여 개발자가 필요에 따라 반환할 *Document*를 제한할 수 있도록 한다.

통상적으로 *Collection*에 저장된 *Document*의 개수가 100개 또는 1,000개 미만인 경우,  
`toArray()` 메서드를 이용해 반환된 *Cursor Object*를 *Javasript Array*로 변환하여 사용한다.

이후 *Controller*에서 `Product.fetchAll()`과 같이 메서드를 호출하여 반환되는 *Document*를 사요할 수 있다.


## Fetching One Data from MongoDB

*Collection*에 저장된 모든 데이터를 가져오는 방법에 이어, 단일 데이터를 가져오는 방법을 알아본다.

```
// models/product.js

const mongodb = require('mongodb');
const getDatabase = require('util/database.js').getDatabase;

class Product {

    /* 생략 */

    static fetchById(productID) {
        const database = getDatabase();

        return database.collection('products')
            .find({ _id: new mongodb.ObjectId(productID) })  // Get Cursor Object
            .next()
            .then(product => {
                return product;
            })
            .catch(error => console.log(error));
    }
}

module.exports = Product;
```

앞에서 간략히 언급한 것과 같이, `find()` 메서드에 특정한 조건을 정의하는 *Javascript Object*를 전달하여 조건에 해당하는 *Document*를 가져올 수 있다.  
`find()` 메서드는 **특정한 조건에 해당하는 결과가 단 하나만 존재하는지, 여러개 존재하는지 알지 못하므로 여전히 *Cursor Object*를 반환**한다.  
따라서, `next()` 메서드를 호출해 반환된 *Cursor Object*에서 *Document*를 추출해야 한다.  

여기서 주의해야할 것은, `find({ _id: productID })` 메서드는 정상적으로 작동하지 않는다는 점이다.  
`_id`가 **MongoDB에서 사용하는 *BSON* 타입의 객체**이기 때문이며, 따라서 단순한 문자열인 `productID`와 비교될 수 없는 것이다.  

즉, `_id`와 `productID`의 값을 비교하려면 위의 예시의 `new mongodb.ObjectId(productID)`에서와 같이  
`productID`를 ***MongoDB Driver*에 내장된 *ObjectId* 클래스의 인스턴스로 생성하여 비교**해야 한다.


## Updating One Data on MongoDB

데이터를 저장하고 조회하는 기능에 이어 기존에 작성한 *Data Model* 코드를 변경하여, 데이터를 수정하는 방법에 대해 알아본다.

```
// models/product.js

const mongodb = require('mongodb');
const getDatabase = require('util/database.js').getDatabase;

class Product {
    constructor(title, price, id) {
        this.title = title;
        this.price = price;
        this._id = id ? new mongodb.ObjectId(id) : null;  // 중요!
    }

    save() {
        const database = getDatabase();
        let databaseOperation;

        if (this._id) {
            // Update the product
            databaseOperation = database.collection('products').updateOne({
                { _id: this._id },
                { $set: this }
            })
        }
        else {
            // Create new product
            databaseOperation = database.collection('products').insertOne(this);
        }

        return databaseOperation
            .then(result => console.log(result))
            .catch(error => console.log(error));
    }
}

module.exports = Product;
```

데이터 수정 기능을 추가하기 위해, *Data Model*의 생성자에 매개변수 `id`를 추가한다.  

**[참고]** 생성자가 호출되어 새로운 인스턴스를 생성할 때, 매개변수 `id`에 아무런 값도 전달되지 않는다면,  
`this._id`에 `undefined` 값이 전달되고, 최종적으로는 MongoDB에서 생성하는 *ObejctId* 인스턴스가 사용될 것이다.

다음으로, `this._id`에 값이 존재하면 데이터 수정 기능을 수행하고, 그렇지 않으면 데이터 생성 기능을 수행하도록 조건문을 추가한다.  
여기서 `updateOne()` 또는 `insertOne()` 메서드의 수행 결과로 반환되는 *Promise*를 `databaseOperation` 변수에 저장하고,  
조건문에 의한 분기가 종료되고 `save()` 함수의 마지막에서 `databaseOperation`에 `then()`, `catch()`를 추가해 반환하도록 변경한다.

#### updateOne()

`updateOne()` 메서드를 호출할 때, 최소 두 개의 매개변수를 필수적으로 전달해야한다. 

먼저 `find()` 메서드와 같이 *Javscript Object*를 사용해 특정한 *Document*를 선택하기 위한 조건을 설정한다.  
다음으로 *Document*를 수정하는 방식을 설정해야 하는데, MongoDB에서 지정하는 특수한 `key`인 `$set`을 이용해 설정할 수 있다.

`{ $set: this }`는 `this`에 포함된 모든 `key`를 수정하도록 설정하며, `{ $set: { title: this.tile } }`과 같이 사용하면  
`title`을 제외한 `this`에 포함된 나머지 `key`는 변경하지 않고, `title`만 수정하게 된다.  

**[참고]** `{ $set: this }`를 사용해도 `_id`는 수정되지 않는다.


## Deleting One Data on MongoDB

마지막으로, CRUD 기능 중 *Delete* 기능을 구현하는 방법에 대해 알아본다.

```
// models/product.js

const mongodb = require('mongodb');
const getDatabase = require('util/database.js').getDatabase;

class Product {

    /* 생략 */

    static deleteById(productID) {
        const database = getDatabase();

        return database.collection('products')
            .deleteOne({ _id: new mongodb.ObjectId(productID) })
            .next()
            .then(result => {
                console.log('Deleted!');
                return result;
            })
            .catch(error => console.log(error));
    }
}

module.exports = Product;
```

앞서 사용했던 `find()`, `updateOne()` 메서드와 동일한 방식으로 특정한 *Document*를 지정하기 위한 *filter*를  
`deleteOne()` 메서드에 *Javascript Object*의 형식으로 전달하면 데이터를 삭제할 수 있다.

**[참고]** `insertOne()`, `updateOne()`, `deleteOne()`과 같이 `One`이 붙는 메서드는 `Many`로 변경하면 다수의 데이터를 한번에 처리할 수 있다.