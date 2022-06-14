let LOADIP = "http://10.198.21.128:8888";
let Ip = {
  productIP: LOADIP + "/",
};
let faqIp = "http://10.198.23.65:35000/";
let dialogIp = "http://10.198.21.8:36100/";
let path = {
  website: {
    // diglog-tag
    getIntent: Ip.productIP + "get_intent",
    saveSlot: Ip.productIP + "get_data",
    getList: Ip.productIP + "get_alldata",
    deleteData: Ip.productIP + "delete_data",

    // online-chatting
    getDialogResponse: dialogIp + "senseauto/dialog",

    // app
    getAppList: faqIp + "app/list",
    createApp: faqIp + "app/create",
    updateApp: faqIp + "app/update",
    deleteApp: faqIp + "app/delete",

    // corpus
    createCorpus: faqIp + "corpus/create",
    createManyCorpus: faqIp + "corpus/create_many",
    deleteCorpus: faqIp + "corpus/delete",
    deleteManyCorpus: faqIp + "corpus/delete_many",
    updateCorpus: faqIp + "corpus/update",
    getCorpus: faqIp + "corpus/get",
    getAllCorpus: faqIp + "corpus/get_all",
    takeOnCorpus: faqIp + "corpus/take_on",
    takeOffCorpus: faqIp + "corpus/take_off",

    // model
    trainModel: faqIp + "model/train/start",
    stateModel: faqIp + "model/train/state",
    updateModelAuto: faqIp + "model/auto_train/update",
    updateModelParam: faqIp + "model/train_para/update",
    replyModel: faqIp + "model/reply",
    getModelThreshold: faqIp + "model/get_threshold",
    setModelThreshold: faqIp + "model/set_threshold",
    reloadModel: faqIp + "model/reload",
    updateModelChitchat: faqIp + "model/chitchat/update",
    updateModelSensitive: faqIp + "model/sensitive/update",
    deployModel: faqIp + "model/deploy",

    //flow
    createFlow: faqIp + "flow/create",
    getFlow: faqIp+"flow/get",
    getAllFlow: faqIp + "flow/list",
    takeOnFlow: faqIp+ "flow/take_on",
    takeOffFlow: faqIp+ "flow/take_off",
    deleteFlow: faqIp+ "flow/delete",
    deleteManyFlow: faqIp+ "flow/delete_many",
    updateFlow: faqIp + "flow/update"

  },
};
export default path;
