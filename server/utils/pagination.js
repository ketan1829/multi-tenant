export const getPagination = (query) => {
    const page = Math.max(parseInt(query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;
  
    return { page, limit, skip };
  };
  
// export const checkAdminPermission = (arr1, arr2) => {
//   let flag = false
//   for(let per in arr1){
//     if(!arr2.includes(per)){
//       flag = false
//     }
// }

