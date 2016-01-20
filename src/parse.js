var parse = {
  /*
   * 解析模板为执行函数
   */
  get: (function() {
    var doParseTemplate = function(content, data) {
      content = content.replace(/\t/g, '  ').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
      // 初始化模板生成器结构
      var struct = [
        'try { var OUT = [];',
        '', //放置模板生成器占位符
        'return OUT.join(\'\'); } catch(e) { throw new Error("parse template error!"); }'
      ];
      // 初始化模板变量
      var vars = [];
      Object.keys(data).forEach(function(name) {
        if(typeof data[name] === 'string') {
          data[name] = '\'' + data[name] + '\'';
        }
        var tmp = typeof data[name] === 'object' ? JSON.stringify(data[name]) : data[name];
        vars.push('var ' + name + ' = ' + tmp + ';');
      });
      vars = vars.join('');
      // 解析模板内容
      var out = [];
      var beg = 0; // 解析文段起始位置
      var stmbeg = 0;  // 表达式起始位置
      var stmend = 0; // 表达式结束位置
      var len = content.length;
      var preHtml = ''; // 表达式前的html
      var endHtml = ''; // 最后一段html
      var stmJs = ''; // 表达式
      while(beg < len) {
        stmbeg = content.indexOf('<%', beg);
        if(stmbeg === -1) {
          // 到达最后一段html
          endHtml = content.substr(beg);
          out.push('OUT.push(\'' + endHtml + '\');');
          break;
        }
        stmend = content.indexOf('%>', stmbeg);
        if(stmend === -1) {
          break;
        }
        preHtml = content.substring(beg, stmbeg);
        out.push('OUT.push(\'' + preHtml + '\');');
        if(content.charAt(stmbeg + 2) === '=') {
          // 针对变量取值
          stmJs = content.substring(stmbeg + 3, stmend);
          out.push('OUT.push((' + stmJs + ').toString());');
        } else {
          // 针对js语句
          stmJs = content.substring(stmbeg + 2, stmend);
          out.push(stmJs);
        }
        beg = stmend + 2;
      }
      out.unshift(vars);
      struct[1] = out.join('');
      return new Function('DATA', struct.join(''));
    };
    /**`
     * 根据模板数据生成代码
     * @method 
     */
    return function(content, data){
      try{
        data = data||{};
        // 解析模板生成代码生成器
        var f = doParseTemplate(content, data);
        return f(data);
      }catch(ex){
        return -1;
      }
    };
  })()
};

module.exports = parse.get;