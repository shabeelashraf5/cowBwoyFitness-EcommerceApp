var express = require('express');
const collectionproduct = require('../model/productsD')
const collectioncategory = require('../model/categoryD')
const collectionwishlist = require('../model/wishlistD')

const allProduct = async function(req, res) {
  try {
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
  
    var sort = '';
    if (req.query.sort) {
      sort = req.query.sort;
    }

    const limit = 12;

    const query = {
      active: true,
      title: {$regex: `.*${search}.*`, $options: 'i'},
      
      
    };

    
    if (req.query.category_title) {
      query['category_id'] = await collectioncategory.findOne({ title: req.query.category_title }).select('_id');
    }

    if (req.query.min_price && req.query.max_price) {
      query.price = { $gte: parseInt(req.query.min_price), $lte: parseInt(req.query.max_price) };
    }

    if (req.query.min_rating) {
      query.rating = { $gte: parseInt(req.query.min_rating) };
    }
    

    let sortOption = {};

    if (sort === 'price_asc') {
      sortOption.price = 1;
    } else if (sort === 'price_desc') {
      sortOption.price = -1;
    } else if (sort === 'title_asc') {
      sortOption.title = 1;
    } else if (sort === 'title_desc') {
      sortOption.title = -1;
    }
     
    console.log("query object:", query);

    const docs = await collectionproduct
      .find(query).populate('category_id', 'title').sort(sortOption).limit(limit * 1).skip((page - 1) * limit);

    const count = await collectionproduct
      .find(query)
      .countDocuments();



    res.render('product-men', {
      productDisplay: docs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      selectedSort: sort, loggedIn: req.session.customerId 
      
    });
  } catch (err) {
    console.log(err.message);
  }
}


const menProduct = async function(req, res) {
  try {
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
  
    var sort = '';
    if (req.query.sort) {
      sort = req.query.sort;
    }

    const limit = 12;

    const query = {
      active: true,
      title: {$regex: `.*${search}.*`, $options: 'i'},
      gender: 'male'
      
    };

    
    if (req.query.category_title) {
      query['category_id'] = await collectioncategory.findOne({ title: req.query.category_title }).select('_id');
    }

    if (req.query.min_price && req.query.max_price) {
      query.price = { $gte: parseInt(req.query.min_price), $lte: parseInt(req.query.max_price) };
    }

    if (req.query.min_rating) {
      query.rating = { $gte: parseInt(req.query.min_rating) };
    }
    

    let sortOption = {};

    if (sort === 'price_asc') {
      sortOption.price = 1;
    } else if (sort === 'price_desc') {
      sortOption.price = -1;
    } else if (sort === 'title_asc') {
      sortOption.title = 1;
    } else if (sort === 'title_desc') {
      sortOption.title = -1;
    }
     
    console.log("query object:", query);

    const docs = await collectionproduct
      .find(query).populate('category_id', 'title').sort(sortOption).limit(limit * 1).skip((page - 1) * limit);

    const count = await collectionproduct
      .find(query)
      .countDocuments();



    res.render('product-men', {
      productDisplay: docs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      selectedSort: sort, loggedIn: req.session.customerId 
      
    });
  } catch (err) {
    console.log(err.message);
  }
}

const womenProduct = async function(req, res) {
  try {
    var search = '';
    if (req.query.search) {
      search = req.query.search;
    }
    var page = 1;
    if (req.query.page) {
      page = req.query.page;
    }
  
    var sort = '';
    if (req.query.sort) {
      sort = req.query.sort;
    }

    const limit = 12;

    const query = {
      active: true,
      title: {$regex: `.*${search}.*`, $options: 'i'},
      gender: 'female'
      
    };

    
    if (req.query.category_title) {
      query['category_id'] = await collectioncategory.findOne({ title: req.query.category_title }).select('_id');
    }

    if (req.query.min_price && req.query.max_price) {
      query.price = { $gte: parseInt(req.query.min_price), $lte: parseInt(req.query.max_price) };
    }

    if (req.query.min_rating) {
      query.rating = { $gte: parseInt(req.query.min_rating) };
    }
    

    let sortOption = {};

    if (sort === 'price_asc') {
      sortOption.price = 1;
    } else if (sort === 'price_desc') {
      sortOption.price = -1;
    } else if (sort === 'title_asc') {
      sortOption.title = 1;
    } else if (sort === 'title_desc') {
      sortOption.title = -1;
    }
     
    console.log("query object:", query);

    const docs = await collectionproduct
      .find(query).populate('category_id', 'title').sort(sortOption).limit(limit * 1).skip((page - 1) * limit);

    const count = await collectionproduct
      .find(query)
      .countDocuments();



    res.render('product-women', {
      productDisplay: docs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      selectedSort: sort, loggedIn: req.session.customerId 
      
    });
  } catch (err) {
    console.log(err.message);
  }
}


 const productSingle = async function (req,res){

  const docs = await collectionproduct.findOne({ _id: req.params.id})

 res.render('single-product', {singleProduct: docs , loggedIn: req.session.customerId })
 }


 const wishlist = async function (req,res){

  try {
    const customerId = req.session.customerId;
    const wishlistDetails = await collectionwishlist
      .find({ customers_id: customerId })
      .populate('product_id');

      const docs = await collectionproduct
      .find({}).populate('category_id', 'title')


    res.render('wishlist', {
      docs: docs,
      wishlistDetails: wishlistDetails,
      loggedIn: req.session.customerId
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  } 

 
 }

 const deleteWishlist = function(req,res){

  const wishlistId = req.params.id;

  collectionwishlist.findByIdAndRemove(wishlistId, (err, deletedwishlist) => {
    if (err) {
      console.log('Error Occured', err);
      res.status(500).send('Error Occured');
    } else {
      console.log('Wishlist deleted:', deletedwishlist);
      res.redirect('/product/wishlist');
    }
  });

} 

const postWishlist = async function(req, res) {
  try {
    const wishlist = new collectionwishlist({
      customers_id: req.session.customerId,
      product_id: req.body.product_id
    });
    await wishlist.save();
    res.send('Product added to wishlist successfully.');
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
};


module.exports = {

    menProduct,
    productSingle,
    wishlist,
    deleteWishlist,
    postWishlist,
    womenProduct,
    allProduct


}

