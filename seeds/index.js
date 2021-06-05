const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(() => {
        console.log("connection open mongo");
    })
    .catch(() => {
        console.log("error try again - mongo");
    })

const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const campground = require('../models/campground');

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new campground({
            author: '60add537e1f0fe1a7cd7fcb0',
            location: `${cities[random1000].city} , ${cities[random1000].state} `,
            title: `${sample(descriptors)} , ${sample(places)}`,
            img: [
                {
                    url: 'https://res.cloudinary.com/rahulwebapp/image/upload/v1622478976/yelp-camp/tpjxgexfehhcrc9h33rj.jpg',
                    filename: 'randomimg1'
                }
            ],
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },

            price: 12,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod illo voluptatibus praesentium repudiandae neque adipisci alias cupiditate eum excepturi? Distinctio exercitationem impedit velit commodi reprehenderit nihil suscipit consectetur, esse, nemo temporibus, saepe aliquid praesentium quasi ab asperiores expedita iusto vel officiis beatae unde ratione neque nostrum. Optio culpa dignissimos temporibus?'
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})