/**
 * Created by hefang on 2017/3/8.
 */
/**
 * doT 初始化
 */
var doTinit = function()
{
  //配置定界符
  doT.templateSettings = {
    evaluate:    /\[\%([\s\S]+?)\%\]/g,
    interpolate: /\[\%=([\s\S]+?)\%\]/g,
    encode:      /\[\%!([\s\S]+?)\%\]/g,
    use:         /\[\%#([\s\S]+?)\%\]/g,
    define:      /\[\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\]/g,
    conditional: /\[\%\?(\?)?\s*([\s\S]*?)\s*\%\]/g,
    iterate:     /\[\%~\s*(?:\%\]|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\])/g,
    varname: 'it',
    strip: true,
    append: true,
    selfcontained: false
  };
}();
