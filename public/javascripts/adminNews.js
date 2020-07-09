$(document).ready(function(){
    console.log("đã kết nối tới adminNews.js");

  /* chức năng thêm,xóa ảnh bên admin tin tức phần chi tiết để sửa */
  $('body').on('click', '.remove11', function () {
    $(this).parent('.ShowImageUploaded').remove();
    const name = $(this).attr('img-name');
    const arr = $('[name="files"]')[0].value.split(',');
    const pos = arr.indexOf(name)
    arr.splice(pos, 1)
    $('[name="files"]')[0].value = arr.join(',');
});

/*---------------End chức năng thêm,xóa ảnh bên admin tin tức phần chi tiết để sửa -------------------------*/


/* chức năng thêm,xóa ảnh bên admin Hãng sản phẩm phần chi tiết để sửa */
$('body').on('click', '.remove2', function () {
$(this).parent('.ShowImageUploaded').remove();
const name = $(this).attr('img-name');
const arr = $('[name="filesBrand"]')[0].value.split(',');
const pos = arr.indexOf(name)
arr.splice(pos, 1)
$('[name="filesBrand"]')[0].value = arr.join(',');
});

/*---------------End chức năng thêm,xóa ảnh bên  admin Hãng sản phẩm phần chi tiết để sửa -------------------------*/

/* chức năng thêm,xóa ảnh bên admin  sản phẩm phần chi tiết để sửa */
$('body').on('click', '.remove3', function () {
$(this).parent('.ShowImageUploaded').remove();
const name = $(this).attr('img-name');
const arr = $('[name="filesProduct"]')[0].value.split(',');
const pos = arr.indexOf(name)
arr.splice(pos, 1)
$('[name="filesProduct"]')[0].value = arr.join(',');
});

/*---------------End chức năng thêm,xóa ảnh bên  admin  sản phẩm phần chi tiết để sửa -------------------------*/


});
    
    
    
    