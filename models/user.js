// users.js

var Sequelize = require('sequelize');
var bcryptjs = require('bcryptjs');

// create a sequelize instance with our local postgres database information.
//var sequelize = new Sequelize('postgres://postgres@localhost:5432/auth-system');
const sequelize = new Sequelize('db_poc', 'root', 'denti2603', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

// setup User model and its fields.
var User = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    hooks: {
        beforeCreate: (user) => {
            const salt = bcryptjs.genSaltSync();
            user.password = bcryptjs.hashSync(user.password, salt);
        }
    }/*,
    instanceMethods: {
        validPassword: function(password) {
            console.log("dans la fct validPassword:")
            return bcryptjs.compareSync(password, this.password);
        }
    }   */ 
});


User.prototype.validPassword= function(password) {
    console.log("dans la fct validPassword:")
    return bcryptjs.compareSync(password, this.password);
};

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = User;
