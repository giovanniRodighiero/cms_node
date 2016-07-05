// function setUpSelect(name, url) {
//   $("#"+name).select2({
//     ajax: {
//       url: url,
//       dataType: "json",
//       type: "GET",
//       data: function (params) {
//         var query = {
//           limit: 0,
//           page: 1
//         }
//         // Query paramters will be ?search=[term]&page=[page]
//         return query;
//       },
//       processResults: function (data) {
//          return {
//              results: $.map(data.results, function (item) {
//                  return {
//                      text: item.name,
//                      id: item.id
//                  }
//              })
//          };
//        }
//     }
//   });
// };
// function test() {
//   console.log('ok');
// }
