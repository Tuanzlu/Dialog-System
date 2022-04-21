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
    deleteData: Ip.productIP + "delete_data",
    getDialogResponse: "http://10.198.21.8:5051/user_turn"
  },
};
export default path;
