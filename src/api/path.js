var LOADIP = "http://10.198.21.128:8888";
let Ip = {
  productIP: LOADIP + "/",
};
let path = {
  website: {
    //个人工作台
    getIntent: Ip.productIP + "get_intent",
    saveSlot: Ip.productIP + "get_data",
    getList: Ip.productIP + "get_alldata",

  },
};
export default path;
