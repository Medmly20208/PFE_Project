const mongoose = require("mongoose");


const expense = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
     
    },
    
    title: {
        type: String,
        required: true,
       
    },
    category:{
        type: String,
        required: true, 
        enum: ['Food','Shelter','Transportation','Entertainment','Other'], 
    },
    amount:{
        type: Number,
        required:true,
    },
    date:{
      type:Date,
      required:true
    }

   
  },
  { timestamps: true }
);




const expenseModel = mongoose.model("expenses", expense);

module.exports = expenseModel;
