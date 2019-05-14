const multer = require("multer");
var path = require("path");
const fs = require("fs");
const setOper = require("../utils/setOper");
const dbSys = require("../utils/dbSystem");
const fileSys = require("../utils/fileSystem");
const Static = require("../StaticInfo");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // console.log(req.params);
    console.log("**********req.user is********");
    console.log(req.user);
    console.log("*********articleId is*******");
    console.log(req.params.articleId);
    if (req.user) {
      cb(
        null,
        createFolder(path.join(req.user._id.toString(), req.params.articleId))
      );
    } else {
      cb(null, "public");
    }
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname); //Appending extension
  }
});

const createFolder = id => {
  let newFolder = path.join("public/uploads/", id);
  if (!fs.existsSync(newFolder)) {
    fs.mkdirSync(newFolder);
  }
  console.log(newFolder);
  return newFolder;
};

var upload = multer({ storage });
var cpUpload = upload.array("userFiles");

module.exports = app => {
  app.post(
    "/upload/:articleId",
    function(req, res, next) {
      createFolder(path.join(req.user._id.toString(), req.params.articleId));
      next();
    },
    cpUpload,
    async function(req, res, next) {
      console.log("/upload/:articleId");
      res.send("ok");
    }
  );

  app.post("/article_analyse", async function(req, res, next) {
    let user = await dbSys.getUserInfo(req.user._id);
    console.log("/article_analyse req.body*********");
    console.log(req.body);

    let picsNeedAdd = await analysePicsNeeded(
      user._id,
      user.articles,
      req.body.articleInfo
    );
    res.send(picsNeedAdd);
  });

  app.post("/article_content", async function(req, res, next) {
    // 这里很奇怪，这个req.user._id居然本身是一个对象而不是 string
    let userId = req.user._id.toString();
    let articleId = req.body.articleId;
    let content = req.body.content;
    console.log("/article_content*********");
    // console.log("userId " + userId);
    // console.log("articleId " + articleId);
    // console.log("content " + content);

    let result = await fileSys.generateArticleFromTemplate(
      userId,
      articleId,
      content
    );
    res.send({
      webLink: Static.OuterIndexPath + userId + "/" + articleId + "/index.html"
    });
  });
};

/**
 * 根据提供的文章信息，判断是否服务器有这个文章，和应对图片进行分类与对应操作。
 *
 * @param {*} userArticleInfo 服务器这个用户的全部发布文章信息
 * @param {*} articleInfo 用户将上传的文章的信息
 * @returns {needAdd,needModifyTitle,needDelete} 图片分类
 */
var analysePicsNeeded = async (userId, userArticleInfo, articleInfo) => {
  console.log("user article Info: " + JSON.stringify(userArticleInfo));
  console.log("article Info: " + JSON.stringify(articleInfo));
  for (let i = 0; i < userArticleInfo.length; i++) {
    if (userArticleInfo[i].articleId === articleInfo.id) {
      // 说明用户在服务器端上传过这个文章
      let prevPics = userArticleInfo[i].pics;
      let afterPics = articleInfo.pics;
      let setOperResult = setOper.picSetOper(prevPics, afterPics);
      console.log("********setOperResult**********");
      console.log(setOperResult);

      // 对几类图片的处理：
      await dbSys.addPicInfo(
        userId,
        userArticleInfo[i].articleId,
        setOperResult.needAdd
      );
      await dbSys.modifyPicInfo(
        userId,
        userArticleInfo[i].articleId,
        setOperResult.needModifyTitle
      );
      await dbSys.removePicInfo(
        userId,
        userArticleInfo[i].articleId,
        setOperResult.needDelete
      );
      // 如有必要，还会删除一些图片
      for (let j = 0; j < setOperResult.needDelete.length; j++) {
        let fileOperResult = await fileSys.deletePicFromArticle(
          userId,
          setOperResult.needDelete[j].id,
          userArticleInfo[i].articleId
        );
        console.log(fileOperResult);
      }
      console.log(setOperResult);
      return setOperResult.needAdd;
    }
  }
  // 执行到这里说明用户之前没有上传过这个文章，那么将这个文章信息加入到用户中
  await dbSys.addArticle(userId, articleInfo);
  console.log(articleInfo.pics);
  return articleInfo.pics;
};
