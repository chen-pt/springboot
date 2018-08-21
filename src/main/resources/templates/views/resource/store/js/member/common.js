/**
 * Created by Administrator on 2017/3/21.
 */

function parseDate(fDate) {

  var fullDate = fDate.split("-");

  return new Date(fullDate[0], fullDate[1]-1, fullDate[2], 0, 0, 0)

}

function isExist(obj) {

  return isEmpty(obj) ? undefined : obj;

}

function isEmpty(val) {

  return val == undefined ||  val == null || val == "" ;

}

/**
 * 校验门店积分权限
 */
function checkPermission() {

  $.post("/common/checkPermission",{

  },function (result) {

    if(result.status == "error"){
      $("#integrate_div").remove();
    }

  })
  
}

/**
 * 更新积分
 */
function integralModify(type,value,buyerId) {

  $.post("/common/integralModify",{
    type : type,
    value : value,
    buyerId : buyerId,
  },function (result) {

    return result.status;

  })

}



