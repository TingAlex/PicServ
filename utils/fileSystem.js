const Static = require("../StaticInfo");
const path = require("path");
const fs = require("fs");

/**
 * 新建 user 文件夹
 *
 * @param {string} id 数据库为用户生成的 id
 */
var createUserFloder = id => {
  let userPath = path.join(Static.LocalFolder, id);
  if (!fs.existsSync(userPath)) {
    fs.mkdirSync(userPath);
    console.log("create user folder: " + id);
  } else {
    console.log("folder exist: " + id);
  }
};

/**
 * 读取文件
 *
 * @param {*} filePath 文章地址
 * @returns 报错信息或是文章内容
 */
var loadContent = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};

/**
 * 在指定路径新建文件
 *
 * @param {string} id
 * @param {*} content
 * @returns {string} 文章是否创建成功的信息
 */
var createArticle = (filePath, content) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      fs.writeFile(filePath, content, err => {
        if (err) {
          reject(err);
        }
        resolve("file generated!");
      });
    } else {
      fs.writeFile(filePath, content, err => {
        if (err) {
          reject(err);
        }
        resolve("file regenerated!");
      });
    }
  });
};

/**
 * 使用模板来将本地传过来的文章内容进行装饰
 *
 * @param {*} userId 用户 id
 * @param {*} articleId 文章 id
 * @param {*} content 文章转化为网链后的内容
 * @returns 文章装饰成功的信息
 */
var generateArticleFromTemplate = async (userId, articleId, content) => {
  let template = await loadContent(Static.TemplatePath);
  template = template.replace("REPLACE_CONTENT", content);
  let finalPath = path.join(
    Static.LocalFolder,
    userId,
    articleId,
    "index.html"
  );
  let result = await createArticle(finalPath, template);
  console.log(result);
  return result;
};

/**
 * 删除文件所在的整个文件夹！
 *
 * @param {*} id 文件 id
 * @returns 是否成功删除的信息
 */
var deleteArticle = id => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(Static.LocalFolder, id);
    let files = [];
    files = fs.readdirSync(filePath);
    files.forEach((file, index) => {
      fs.unlinkSync(filePath + "/" + file);
    });
    fs.rmdir(filePath, err => {
      if (err) {
        reject(err);
      }
      resolve("file remove successfully!");
    });
  });
};

/**
 * 删除文章所在文件夹的指定图片
 * @param {*} userId 用户 id
 * @param {*} picId 图片 id
 * @param {*} articleId 文章 id,也是文章所在文件夹名称
 * @returns 是否成功删除的信息
 */
var deletePicFromArticle = (userId, picId, articleId) => {
  return new Promise((resolve, reject) => {
    let filePath = path.join(
      Static.LocalFolder,
      userId,
      articleId,
      picId + ".png"
    );
    fs.unlink(filePath, err => {
      if (err) {
        reject(err);
      }
      resolve(picId + " pic remove successfully!");
    });
  });
};

// 测试创建 user 文件夹
// createUserFloder("hahaha");

module.exports = {
  createUserFloder,
  deletePicFromArticle,
  deleteArticle,
  generateArticleFromTemplate
};

// generateArticleFromTemplate(
//   "5cd90b2e1006813c1031c428",
//   "a8acdc3c-b577-4fb7-a197-adf2244169d8",
//   `this is me, here I am
// this is me, here I am
// this is me, here I am
// tingtweraweferthsrtgaer</p>
// <p><img src="http://localhost:5000/uploads/5cd90b2e1006813c1031c428/a8acdc3c-b577-4fb7-a197-adf2244169d8/8b97e49a-fe0a-4a32-bf96-2094ad78988e.png" alt="imageTestName"></p>
// <p>ergaerg</p>
// <p><img src="http://localhost:5000/uploads/5cd90b2e1006813c1031c428/a8acdc3c-b577-4fb7-a197-adf2244169d8/758e014f-4f-aafe-49f8-9081-56c770175c35.png" alt="haha.png"></p>
// <p>ergaerg;
// ergaerg</p>
// <p><img src="http://localhost:5000/uploads/5cd90b2e1006813c1031c428/a8acdc3c-b577-4fb7-a197-adf2244169d8/f3bd442b-2b-bd79-415e-9c4a-d80cbf06d64b.png" alt="haha.png"></p>
// <p>// ergaerg</p>`
// );
