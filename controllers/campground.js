const CampGround = require('../models/campground');
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapboxtoken  = process.env.MAP_BOX_TOKEN;
const geocoder = mbxGeocoding({accessToken : mapboxtoken});
module.exports.index = async (req, res) => {
    const campground = await CampGround.find({}).populate('popupText');
    res.render('campground/collection', { campground });
}
module.exports.newcamp = (req, res) => {
    res.render('campground/new');
}

module.exports.createcamp = async (req, res, next) => {
    if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit:1
    }).send();
    const data = req.body;
    const newData = new CampGround(data.campground);
    newData.geometry = geoData.body.features[0].geometry;
    newData.img = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newData.author = req.user._id;
   
    await newData.save();
    console.log(newData);
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campground/${newData._id}`);
}

module.exports.view = async (req, res) => {

    const camp = await CampGround.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!camp) {
        req.flash('error', 'campground not find');
        return res.redirect('/campground');
    }
    res.render('campground/show', { camp });
}
module.exports.edit = async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findById(id)
    if (!campground) {
        req.flash('error', 'campground not find');
        return res.redirect('/campground');
    }
    res.render('campground/edit', { campground });
}
module.exports.deletecamp = async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash('success', 'Campground Deleted successfully');
    res.redirect('/campground');
}




module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.img.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campground/${campground._id}`)
}