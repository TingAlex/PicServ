const mongoose = require("mongoose");
const keys = require("../config/keys");
require("../models/User");
const User = mongoose.model("users");
mongoose.connect(keys.mongoURI);

/**
 * 取得用户全部信息
 *
 * @param {*} userId 用户 id
 * @returns user
 */
const getUserInfo = async userId => {
  const user = await User.findOne({ _id: userId });
  return user;
};

/**
 * 添加一条文章信息
 *
 * @param {*} userId 用户 id
 * @param {*} articleInfo 文章信息
 * @returns user
 */
const addArticle = async (userId, articleInfo) => {
  const user = await User.findOne({ _id: userId });
  user.articles.push({
    articleId: articleInfo.id,
    pics: articleInfo.pics.map(item => ({ title: item.title, picId: item.id }))
  });
  user.spaceUsed = calSpaceUsed(user.articles);
  try {
    await user.save();
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 * 删除文章
 *
 * @param {*} userId 用户 id
 * @param {Array{id:XX}} articleIdArr 文章 id 数组
 * @returns user
 */
const removeArticle = async (userId, articleIdArr) => {
  const user = await User.findOne({ _id: userId });
  for (let i = 0; i < articleIdArr.length; i++) {
    user.articles = user.articles.filter(
      item => item.articleId !== articleIdArr[i].id
    );
  }
  user.spaceUsed = calSpaceUsed(user.articles);
  try {
    await user.save();
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

/**
 * 向文章中添加图片信息
 *
 * @param {*} userId 用户 id
 * @param {*} articleId 文章 id
 * @param {Array{title,id}} picInfoArr 图片信息数组
 * @returns user
 */
const addPicInfo = async (userId, articleId, picInfoArr) => {
  const user = await User.findOne({ _id: userId });
  for (let j = 0; j < user.articles.length; j++) {
    let article = user.articles[j];
    if (article.articleId === articleId) {
      for (let i = 0; i < picInfoArr.length; i++) {
        article.pics.push({
          title: picInfoArr[i].title,
          picId: picInfoArr[i].id
        });
      }
    }
  }
  user.spaceUsed = calSpaceUsed(user.articles);
  try {
    await user.save();
    return user;
  } catch (err) {
    return null;
  }
};

/**
 * 修改文章中的图片 title
 *
 * @param {*} userId 用户 id
 * @param {*} articleId 文章 id
 * @param {Array{id,title}} picInfoArr 图片信息数组
 * @returns user
 */
const modifyPicInfo = async (userId, articleId, picInfoArr) => {
  const user = await User.findOne({ _id: userId });
  for (let j = 0; j < user.articles.length; j++) {
    let article = user.articles[j];
    if (article.articleId === articleId) {
      for (let i = 0; i < article.pics.length; i++) {
        let pic = article.pics[i];
        for (let k = 0; k < picInfoArr.length; k++) {
          if (pic.picId === picInfoArr[k].id) {
            pic.title = picInfoArr[k].title;
            break;
          }
        }
      }
    }
  }
  try {
    await user.save();
    return user;
  } catch (err) {
    console.log(err);
  }
};

/**
 * 从文章中删除图片信息
 *
 * @param {*} userId 用户 id
 * @param {*} articleId 文章 id
 * @param {Array{id:XX}} picIdArr 图片信息数组
 * @returns user
 */
const removePicInfo = async (userId, articleId, picIdArr) => {
  const user = await User.findOne({ _id: userId });
  for (let j = 0; j < user.articles.length; j++) {
    let article = user.articles[j];
    if (article.articleId === articleId) {
      for (let k = 0; k < picIdArr.length; k++) {
        article.pics = article.pics.filter(
          item => item.picId !== picIdArr[k].id
        );
      }
    }
  }
  user.spaceUsed = calSpaceUsed(user.articles);
  try {
    await user.save();
    return user;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const calSpaceUsed = articles => {
  let count = 0;
  for (let i = 0; i < articles.length; i++) {
    count += articles[i].pics.length;
  }
  return count;
};

module.exports = {
  getUserInfo,
  addArticle,
  removeArticle,
  addPicInfo,
  modifyPicInfo,
  removePicInfo
};

let userId = "5cd561014eaaa83d547746ef";
let articleInfo = {
  id: "a8acdc3c-b577-4fb7-a197-adf2244169d8",
  lastModefiedTime: "2019-04-13T02:04:37.106Z",
  pics: [
    {
      id: "8b97e49a-fe0a-4a32-bf96-2094ad78988e",
      title: "imageTestName"
    },
    {
      id: "758e014f-aafe-49f8-9081-56c770175c35",
      title: "haha.png"
    },
    {
      id: "f3bd442b-bd79-415e-9c4a-d80cbf06d64b",
      title: "haha.png"
    }
  ]
};
let picInfo = [
  {
    title: "modify1.jpg",
    id: "583926f8-9dca-4431-823b-14d5ddf1fe61"
  },
  {
    title: "modify2.png",
    id: "3de6c443-7066-442b-adcc-2819ca454584"
  }
];
let test = async () => {
  // let result = await getUserInfo(userId);
  // let result = await addArticle(userId, articleInfo);
  // let result = await removeArticle(userId, articleInfo.id);
  // let result = await addPicInfo(userId, articleInfo.id, picInfo);
  // let result = await modifyPicInfo(userId, articleInfo.id, picInfo);
  // let result = await removePicInfo(userId, articleInfo.id, picInfo);
  // console.log(result);
};

// test();

let addedArticle_OnMlab = {
  _id: {
    $oid: "5cd561014eaaa83d547746ef"
  },
  spaceUsed: 3,
  spaceLimit: 100,
  userName: "qw",
  email: "12@qq.com",
  password: "12",
  articles: [
    {
      _id: {
        $oid: "5cd7d79722b1e3139c82aeb8"
      },
      articleId: "a8acdc3c-b577-4fb7-a197-adf2244169d8",
      pics: [
        {
          _id: {
            $oid: "5cd7d79722b1e3139c82aebb"
          },
          title: "imageTestName",
          picId: "8b97e49a-fe0a-4a32-bf96-2094ad78988e"
        },
        {
          _id: {
            $oid: "5cd7d79722b1e3139c82aeba"
          },
          title: "haha.png",
          picId: "758e014f-aafe-49f8-9081-56c770175c35"
        },
        {
          _id: {
            $oid: "5cd7d79722b1e3139c82aeb9"
          },
          title: "haha.png",
          picId: "f3bd442b-bd79-415e-9c4a-d80cbf06d64b"
        }
      ]
    }
  ],
  __v: 2
};

let addedPicInfo_OnMlab = {
  _id: {
    $oid: "5cd561014eaaa83d547746ef"
  },
  spaceUsed: 5,
  spaceLimit: 100,
  userName: "qw",
  email: "12@qq.com",
  password: "12",
  articles: [
    {
      _id: {
        $oid: "5cd7da29b373851244850f15"
      },
      articleId: "a8acdc3c-b577-4fb7-a197-adf2244169d8",
      pics: [
        {
          _id: {
            $oid: "5cd7da29b373851244850f18"
          },
          title: "imageTestName",
          picId: "8b97e49a-fe0a-4a32-bf96-2094ad78988e"
        },
        {
          _id: {
            $oid: "5cd7da29b373851244850f17"
          },
          title: "haha.png",
          picId: "758e014f-aafe-49f8-9081-56c770175c35"
        },
        {
          _id: {
            $oid: "5cd7da29b373851244850f16"
          },
          title: "haha.png",
          picId: "f3bd442b-bd79-415e-9c4a-d80cbf06d64b"
        },
        {
          _id: {
            $oid: "5cd7dd3c2dfeb237c076ccb7"
          },
          title: "add.jpg",
          picId: "583926f8-9dca-4431-823b-14d5ddf1fe61"
        },
        {
          _id: {
            $oid: "5cd7dd3c2dfeb237c076ccb8"
          },
          title: "add2.png",
          picId: "3de6c443-7066-442b-adcc-2819ca454584"
        }
      ]
    }
  ],
  __v: 5
};
let modifyPicInfo_OnMlab = {
  _id: {
    $oid: "5cd561014eaaa83d547746ef"
  },
  spaceUsed: 5,
  spaceLimit: 100,
  userName: "qw",
  email: "12@qq.com",
  password: "12",
  articles: [
    {
      _id: {
        $oid: "5cd7da29b373851244850f15"
      },
      articleId: "a8acdc3c-b577-4fb7-a197-adf2244169d8",
      pics: [
        {
          _id: {
            $oid: "5cd7da29b373851244850f18"
          },
          title: "imageTestName",
          picId: "8b97e49a-fe0a-4a32-bf96-2094ad78988e"
        },
        {
          _id: {
            $oid: "5cd7da29b373851244850f17"
          },
          title: "haha.png",
          picId: "758e014f-aafe-49f8-9081-56c770175c35"
        },
        {
          _id: {
            $oid: "5cd7da29b373851244850f16"
          },
          title: "haha.png",
          picId: "f3bd442b-bd79-415e-9c4a-d80cbf06d64b"
        },
        {
          _id: {
            $oid: "5cd7dd3c2dfeb237c076ccb7"
          },
          title: "modify1.jpg",
          picId: "583926f8-9dca-4431-823b-14d5ddf1fe61"
        },
        {
          _id: {
            $oid: "5cd7dd3c2dfeb237c076ccb8"
          },
          title: "modify2.png",
          picId: "3de6c443-7066-442b-adcc-2819ca454584"
        }
      ]
    }
  ],
  __v: 5
};
let removePicInfo_OnMlab = {
  _id: {
    $oid: "5cd561014eaaa83d547746ef"
  },
  spaceUsed: 3,
  spaceLimit: 100,
  userName: "qw",
  email: "12@qq.com",
  password: "12",
  articles: [
    {
      _id: {
        $oid: "5cd7da29b373851244850f15"
      },
      articleId: "a8acdc3c-b577-4fb7-a197-adf2244169d8",
      pics: [
        {
          _id: {
            $oid: "5cd7da29b373851244850f18"
          },
          title: "imageTestName",
          picId: "8b97e49a-fe0a-4a32-bf96-2094ad78988e"
        },
        {
          _id: {
            $oid: "5cd7da29b373851244850f17"
          },
          title: "haha.png",
          picId: "758e014f-aafe-49f8-9081-56c770175c35"
        },
        {
          _id: {
            $oid: "5cd7da29b373851244850f16"
          },
          title: "haha.png",
          picId: "f3bd442b-bd79-415e-9c4a-d80cbf06d64b"
        }
      ]
    }
  ],
  __v: 6
};

let testAddAndRemoveInfoAndFile_OnMlab = {
  _id: {
    $oid: "5cd561014eaaa83d547746ef"
  },
  spaceUsed: 3,
  spaceLimit: 100,
  userName: "qw",
  email: "12@qq.com",
  password: "12",
  articles: [
    {
      _id: {
        $oid: "5cd7da29b373851244850f15"
      },
      articleId: "a8acdc3c-b577-4fb7-a197-adf2244169d8",
      pics: [
        {
          _id: {
            $oid: "5cd7da29b373851244850f17"
          },
          title: "wawa.png",
          picId: "758e014f-aafe-49f8-9081-56c770175c35"
        },
        {
          _id: {
            $oid: "5cd8d54beeaa792094007c42"
          },
          picId: "8b97e49a-fe0a-4a32-bf96-2094ad78988e"
        },
        {
          _id: {
            $oid: "5cd8d54beeaa792094007c43"
          },
          picId: "f3bd442b-bd79-415e-9c4a-d80cbf06d64b"
        }
      ]
    }
  ],
  __v: 12
};
