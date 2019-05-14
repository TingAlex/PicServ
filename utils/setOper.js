// let a = [{ id: "3" }, { id: "1" }];
// let b = [{ id: 3 }, { id: 5 }, { id: 2 }];

/**
 * 根据用户云端本文章的图片数组与本地发送的图片数据得到需要删除，添加，修改title的三类图片的id
 *
 * @param {Array{title,picId}} prev 云端文章的图片数据
 * @param {Array{title,id}} after 本地发送过来的图片数组
 * @returns {needModify,needDelete,needAdd}
 */
const picSetOper = (prev, after) => {
  let i = 0,
    j = 0;
  let needModifyTitleInfo = [];
  let needDeleteInfo = [];
  let needAddInfo = [];
  prev.sort((a, b) => {
    if (a.picId < b.picId) {
      return -1;
    }
    if (a.picId > b.picId) {
      return 1;
    }
    return 0;
  });
  after.sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  });
  // console.log(prev);
  // console.log(after);

  for (i; i < prev.length; i++) {
    if (j === after.length) {
      break;
    }
    if (prev[i].picId === after[j].id) {
      if (prev[i].title !== after[j].title) {
        needModifyTitleInfo.push({ id: after[j].id, title: after[j].title });
      }
      j++;
      continue;
    }
    if (prev[i].picId < after[j].id) {
      needDeleteInfo.push({ id: prev[i].picId });
      continue;
    }
    if (prev[i].picId > after[j].id) {
      needAddInfo.push({ id: after[j].id });
      j++;
      i--;
    }
  }
  for (j; j < after.length; j++) {
    needAddInfo.push({ id: after[j].id });
  }
  for (i; i < prev.length; i++) {
    needDeleteInfo.push({ id: prev[i].picId });
  }
  return {
    needModifyTitle: needModifyTitleInfo,
    needDelete: needDeleteInfo,
    needAdd: needAddInfo
  };
};

// let a = [
//   {
//     _id: "5cd7da29b373851244850f16",
//     title: "haha.png",
//     picId: "f3bd442b-bd79-415e-9c4a-d80cbf06d64b"
//   },
//   {
//     _id: "5cd7da29b373851244850f18",
//     title: "imageTestName",
//     picId: "8b97e49a-fe0a-4a32-bf96-2094ad78988e"
//   },
//   {
//     _id: "5cd7da29b373851244850f17",
//     title: "haha.png",
//     picId: "758e014f-aafe-49f8-9081-56c770175c35"
//   }
// ];
// let b = [
//   { id: "758e014f-aafe-49f8-9081-56c770175c35", title: "lala.png" },
//   { id: "8b97e49a-fe0a-4a32-bf96-2094ad78988e", title: "imageTestName" }
// ];
// let a = [
//   {
//     _id: "5cd917a34beb8706a08077ae",
//     title: "imageTestName",
//     picId: "8b97e49a-fe0a-4a32-bf96-2094ad78988e"
//   },
//   {
//     _id: "5cd917a34beb8706a08077ad",
//     title: "haha.png",
//     picId: "f3bd442b-bd79-415e-9c4a-d80cbf06d64b"
//   },
//   {
//     _id: "5cda23e95506a43dec0da963",
//     picId: "758e014f-aafe-49f8-9081-56c770175c35"
//   }
// ];
// let b = [
//   {
//     title: "imageTestName",
//     id: "8b97e49a-fe0a-4a32-bf96-2094ad78988e"
//   },
//   {
//     title: "haha.png",
//     id: "758e014f-aafe-49f8-9081-56c770175c35"
//   },
//   {
//     title: "haha.png",
//     id: "f3bd442b-bd79-415e-9c4a-d80cbf06d64b"
//   }
// ];
// let result = picSetOper(a, b);
// console.log(result);

module.exports = {
  picSetOper
};

// let result = picSetOper(a, b);
// console.log(result);
