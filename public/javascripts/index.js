
$(document).ready(function(){

       
  /* -------------Xử lý Chức năng Search Suggestion---------------  */
function KhongDau(str){ //hàm chuyển chữ có dẫu thành ko dấu
	if (typeof str != 'string')
		return null;

	str = str.replace(/(á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ)/g, 'a');
	str = str.replace(/(A|Á|À|Ả|Ã|Ạ|Ă|Ắ|Ằ|Ẳ|Ẵ|Ặ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ)/g, 'A');
	str = str.replace(/đ/g, 'd');
	str = str.replace(/Đ/g, 'D');
	str = str.replace(/(é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ)/g, 'e');
	str = str.replace(/(É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ)/g, 'E');
	str = str.replace(/(í|ì|ỉ|ĩ|ị)/g, 'i');
	str = str.replace(/(Í|Ì|Ỉ|Ĩ|Ị)/g, 'I');
	str = str.replace(/(ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ)/g, 'o');
	str = str.replace(/(Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ)/g, 'O');
	str = str.replace(/(ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự)/g, 'u');
	str = str.replace(/(Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự)/g, 'U');
	str = str.replace(/(ý|ỳ|ỷ|ỹ|ỵ)/g, 'y');
	str = str.replace(/(Ý|Ỳ|Ỷ|Ỹ|Ỵ)/g, 'Y');

	str = str.replace(/[^a-zA-Z0-9_-]/g, '-');

	while (str.length > 0 && (/--/g).test(str)){
		str = str.replace(/--/g, '-');
	}
	return str.toLowerCase();
};
var data_search_sugesstion = document.getElementsByClassName("list");
var data_search_sugesstion = jQuery.makeArray(data_search_sugesstion);
data_search_sugesstion.reverse();
data_search_sugesstion = data_search_sugesstion.map(data => data.innerHTML); //đây là dữ liệu lấy về dưới dạng mảng
const handleSource = ({ term }, response) => {  //biến term này do jquery định nghĩa, là biến lấy dữ liệu khi nhập input search
    response(data_search_sugesstion.filter(item => {
        const comparedWith = KhongDau(item); //chuyển dữ liệu trong mảng lấy được thành chữ không dấu
        const query = KhongDau(term); //chuyển dữ liệu nhập trong input search về không dấu lun
        return comparedWith.indexOf(query) !== -1; // so sánh 2 biến comparedWith và query xem có khớp nhau ko, khớp mới đc return về
    }))
}

$("#search-input").autocomplete({ /* sử dụng jquery autocomplete để tạo chức năng search sugesstion */
    autoFocus: true,
    source:  handleSource //đưa dữ liệu đã được xử lý bên trên vào
}).keydown(function(event){
    if(event.keyCode == 13) {
      if($("#search-input").val().length==0) {+
          event.preventDefault();
          return false;

      }
       $("#submit").click();  /*tự động click button khi chọn option ở ô search*/
       console.log("đã nhấn enter")

    }
 });

 $( "#search-input" ).autocomplete(   /* xử lý sự kiện khi nhấn vào từng mục gợi ý của search thì mới chạy*/
    {
         source: handleSource,
         select: function(event, ui) {
            $("#search-input").val(ui.item.value);
            $("#submit").click();
  }
    })
/*Kết thúc Xử lý Chức năng Search Suggestion  */

    /* -------------chức năng show less và show more ở trang tìm kiếm ------------*/
    size_li = $(".resutl_item_search").size();
    console.log(" size_li:"+ size_li)
    x=9;
    if(x > size_li){
        $('#loadMore').hide();
    }
    if(x == size_li){
        $('#loadMore').hide();
    }
    $('.resutl_item_search:lt('+x+')').show(300);
    $('#loadMore').click(function () {
        x= (x+6 <= size_li) ? x+6 : size_li;
        $('.resutl_item_search:lt('+x+')').show(300);
        $('#showLess').show();
        if(x == size_li){
            $('#loadMore').hide(300);
        }
       
        


    $('#showLess').click(function () {
            x=(x-6<0) ? 9 : x-6;
            $('.resutl_item_search').not(':lt('+x+')').hide(300);
            $('#loadMore').show();
            $('#showLess').show();
           if(x == 9){
               $('#showLess').hide();
           }
        });
    })
   
    /* End chức năng show less và show more ở trang tìm kiếm */

    
        /* ---------Chức năng ẩn hiện comment và phản hồi khi nhấn nút phản hồi -----------*/
        $('.comment-reply-btn').click(function(event){
            console.log("đã click");
            event.preventDefault();
            $(this).parent().next(".Reply_Comment").fadeToggle();
        })
     /* -----End----Chức năng ẩn hiện comment và phản hồi khi nhấn nút phản hồi -----------*/
    $(".carousel-inner .carousel-item:nth-child(1)").addClass('active');/* xử lý cho slide boostrap ở trang chủ */

    /*-------------- xử lý cho slide */
    
    $('#image-gallery').lightSlider({
        gallery:true,
        item:1,
        thumbItem:9,
        slideMargin: 0,
        speed:500,
        auto:true,
        loop:true,
        onSliderLoad: function() {
            $('#image-gallery').removeClass('cS-hidden');
        }  
    });

   
 //-----------xử lý nút kéo lên trang đầu
   
 $(window).scroll(function(){ 
    if ($(this).scrollTop() > 100) { 
        $('.on_top').fadeIn(); 
    } else { 
        $('.on_top').fadeOut(); 
    } 
}); 
$('.on_top').click(function(){ 
    $("html").animate({ scrollTop: 0 },600); 
    return false; 
}); 

//end xử lý nút kéo lên trang đầu
var numberProduct=$(".checkbox_cart").length
console.log("mảng:"+numberProduct)

function handleSubmiButton(){

  
    if ($('.checkbox:checked').length > 0){
         
        $('.btn_confirm_cart').addClass('btn_visible_submit');
    }
    else{
        $('.btn_confirm_cart').removeClass('btn_visible_submit');
      
    }
    if ($('.checkbox:checked').length == numberProduct){
        $(".selectall").prop('checked', true);
    } else {
        $(".selectall").removeAttr("checked");
    }
     
}

    new WOW().init(); /*------------ kích hoạt wow.js*/


    //----------hàm xử lí khi click vào ô checkbox chọn tất cả
    var checkAll=0;
    $('.selectall').click(function() {
        var wrap = $("#listItem");
        wrap.empty();
        
        if ($(this).is(':checked')) {
            $('input:checkbox').prop('checked', true);
            checkAll= $('input:checkbox').length-1
            var total = 0;
            $('.checkbox:checked').each(function() {
                total += parseFloat(MakeInterger($(this).attr('data-price')));
                //script them sp vao bang thong tin gio hang
                var wrap = $("#listItem");
                var rowHtml = $(document.createElement('div')).addClass("row").appendTo(wrap);
                var detail = $(document.createElement('div')).addClass("col-6").appendTo(rowHtml);
                var name = $(document.createElement('p')).addClass("size_info_total").attr("idProduct",$(this).attr('idProduct')).text($(this).attr('nameProduct')).appendTo(detail);
                var qty = $(document.createElement('p')).text("x"+$(this).attr('data-qty')).appendTo(detail);
                var price = $(document.createElement('p')).addClass("col-6").text($(this).attr('data-price')+" VND").appendTo(rowHtml);
            });
            $('.iff1').text(MakeDecimal(total)+" VND")
        } else {
            $('input:checkbox').prop('checked', false);
            var wrap = $("#listItem");
            wrap.empty()
            $('.iff1').text("0 VND")
        }
        handleSubmiButton();
        
        
    });

   
 /*----------------------- Chức năng lọc sản phẩm theo tên hãng */
 $('.list_brand ul li ').click(function(){

    var danhmuc=$(this).data('class'); /* nghĩa là data có tên là class, bên html là data-class*/


      $('.list_device .row .detail_Sanpham').each(function(){
        if($(this).hasClass(danhmuc))
        {    
           
                $(this).addClass('hienra'); 
                $(this).removeClass('bienmat'); 
                   
        }
        else{   
                $(this).addClass('bienmat');
                $(this).removeClass('hienra');

             }
      });
     
    if(danhmuc==='all')
    {
        $('.list_device .row .detail_Sanpham').each(function(){
            $(this).addClass('hienra'); 
            $(this).removeClass('bienmat');   
           
        });
    }
      
});
$('#btnChangeInfo').click(function(){
    if (confirm('Bạn có muốn tiếp tục không?')) {
        return true;
    } else {
        return false;
    }

})
//get code to reset pasword
$("#btn_getReset").click(function(){
    var abc = $("#disNoti");
    abc.empty();
    var email = $("#inputEmailReset").val()
    console.log(email)
    $.ajax({
        type: 'GET',
        url: '/users/getkeyreset/'+$("#inputEmailReset").val(),
    })
    .done(function(data){
        if(data == "success"){
            
            $("#btn_getReset").hide()
            $("#formResetPass").hide();
            $('#formResetPass2').show()
            var wrap = $("#disNoti");
            var rowHtml = $(document.createElement('div')).addClass("alert alert-success alert-dismissible fade show").attr("role","alert").appendTo(wrap);
            $(document.createElement('p')).text("Xác nhận email thành công, vui lòng kiểm tra hộp thư!").appendTo(rowHtml);
            var btn = $(document.createElement('button')).addClass("close").attr("type","button").attr("data-dismiss","alert").attr("aria-label","Close").appendTo(rowHtml);
            $(document.createElement('span')).attr("aria-hidden","true").text("x").appendTo(btn);
        }
        else{
            var wrap = $("#disNoti");
            var rowHtml = $(document.createElement('div')).addClass("alert alert-warning alert-dismissible fade show").attr("role","alert").appendTo(wrap);
            $(document.createElement('p')).text(data).appendTo(rowHtml);

            var btn = $(document.createElement('button')).addClass("close").attr("type","button").attr("data-dismiss","alert").attr("aria-label","Close").appendTo(rowHtml);
            $(document.createElement('span')).attr("aria-hidden","true").text("x").appendTo(btn);
        }
    })
})
//vaify code to reset
$('#btn_verify').click(function(){
    var abc = $("#disNoti");
    abc.empty();
    var code = $("#inputCodeReset").val()
    var email = $("#inputEmailReset").val()
    url = '/users/verifyCode/'+$("#inputEmailReset").val()+'/'+$("#inputCodeReset").val();
    console.log(email)
    $.ajax({
        type: 'GET',
        url: '/users/verifyCode/'+$("#inputEmailReset").val()+'/'+$("#inputCodeReset").val(),
    })
    .done(function(data){
        if(data == "success")
        {
            alert(data)
            $('#formResetPass2').hide()
            $('#formResetPass3').show()
            $('#btn_resetPass').show()
        }
        else{
            var wrap = $("#disNoti");
            var rowHtml = $(document.createElement('div')).addClass("alert alert-warning alert-dismissible fade show").attr("role","alert").appendTo(wrap);
            $(document.createElement('p')).text(data).appendTo(rowHtml);

            var btn = $(document.createElement('button')).addClass("close").attr("type","button").attr("data-dismiss","alert").attr("aria-label","Close").appendTo(rowHtml);
            $(document.createElement('span')).attr("aria-hidden","true").text("x").appendTo(btn);
        }
    })
})
//reset pass
$("#btn_resetPass").click(function(){
    var pass = $("#pass").val()
    var pass1 = $("#pass1").val()
    $.ajax({
        type: 'POST',
        url: '/users/resetPass',
        data: JSON.stringify({
            Password: $("#pass").val(),
            Password1: $("#pass1").val(),
            Email: $("#inputEmailReset").val(),
        }),
        contentType: "application/json",
    })
    .done(function(data){
        if(data == "Mật khẩu không khớp!")
        {
            var wrap = $("#disNoti");
            var rowHtml = $(document.createElement('div')).addClass("alert alert-warning alert-dismissible fade show").attr("role","alert").appendTo(wrap);
            $(document.createElement('p')).text(data).appendTo(rowHtml);

            var btn = $(document.createElement('button')).addClass("close").attr("type","button").attr("data-dismiss","alert").attr("aria-label","Close").appendTo(rowHtml);
            $(document.createElement('span')).attr("aria-hidden","true").text("x").appendTo(btn);
        }
        else{
            window.location.replace(data);
        }
    })
})
// hien thi list don hang hoan thanh va chua hoan thanh

$('#nav-listOrder li').click(function(e) { 
    if($(this).find("a").attr('id') === "showlistOrdersHandling"){

        console.log("Hien thi don hanh chua hoan thanh")
        $('#listOrdersHandling').show()
        $('#listOrdersCompleted').hide()
    }
    else{

        console.log("Hien thi don hanh hoan thanh")
        $('#listOrdersHandling').hide()
        $('#listOrdersCompleted').show()
    }
});
/* ------------tính năng xử xí footer xuất hiện cho hợp lý */
var vitri = $('.footer').offset();
  if(vitri.top <= 600){
       $('.empty_search').removeClass('diableDiv');
       console.log("vị trí của footer nhỏ hơn 600px");
  }
  else{
      $('.empty_search').addClass('diableDiv');
      console.log("vị trí của footer lớn hơn 600px");
  }
/* --------End----tính năng xử xí footer xuất hiện cho hợp lý */

/* -------------chức năng chuyển background color của item menu khi click vào*/
  var pathname = window.location.pathname;
  atag = $('.nav-item  a[href="'+pathname+'"]  ');
  atag.parent().addClass("activeMenu");
  /* ----------End---chức năng chuyển background color của item menu khi click vào*/

  
    // --------------script su kien click chon sp
    $('.checkbox').change(function() {
        var total = 0;
        var wrap = $("#listItem");
        wrap.empty()
        $('.checkbox:checked').each(function() {
            total += parseFloat(MakeInterger($(this).attr('data-price')));
            //script them sp vao bang thong tin gio hang
            var wrap = $("#listItem");
            var rowHtml = $(document.createElement('div')).addClass("row").appendTo(wrap);
            var detail = $(document.createElement('div')).addClass("col-6").appendTo(rowHtml);
            var name = $(document.createElement('p')).addClass("size_info_total").attr("idProduct",$(this).attr('idProduct')).text($(this).attr('nameProduct')).appendTo(detail);
            var qty = $(document.createElement('p')).text("x"+$(this).attr('data-qty')).appendTo(detail);
            var price = $(document.createElement('p')).addClass("col-6").text($(this).attr('data-price')+" VND").appendTo(rowHtml);
        });
        $('.iff1').text(MakeDecimal(total)+" VND")
        handleSubmiButton();
    });
    $("#btnComfirm").click(function(){
        console.log("Comfirm")
        var json = [];
        $('.checkbox:checked').each(function(){
            var wrap = $("#listItem");
            $(document.createElement('input')).attr("type","hidden").attr("name","i").val($(this).attr('idProduct')).appendTo(wrap);
        })
    })
    $("#btnComfirmOrder").click(function(){
        console.log("Comfirm")
        var wrap = $(".infoOrder");
        $(document.createElement('input')).attr("type","hidden").attr("name","totalPrice").val($("#Sum_cost1 span").text()).appendTo(wrap);
        
    })
    
    var part = $(".size_info_total span").text().split(' ')
    console.log(part[0])
    var part1 = $(".size_info span").text().split(' ')
    console.log(part1[0])
    $("#Sum_cost1 span").text(MakeDecimal(MakeInterger(part[0])+ MakeInterger(part1[0])) + " VND")

})

$(document).on('click', '.number-spinner button', function(e) {
    var btn = $(this),
      oldValue = btn.closest('.number-spinner').find('input').val().trim(),
      newVal = 0;
    newVal = (btn.attr('data-dir') === 'up') ? parseInt(oldValue) + 1 : (oldValue > 1) ? parseInt(oldValue) - 1 : 0;
    btn.closest('.number-spinner').find('input').val(newVal);
    Value = btn.closest('.number-spinner').find('input').val().trim();
    
    if(btn.attr('data-dir') === 'up'){
        console.log("tang 1")
        console.log($(this).attr('idProduct'))
        $.ajax({
            type: 'GET',
            url: '/addByOne/'+$(this).attr('idProduct'),
        })
        .done(function(data){
            var total = 0;
            var arr = [];
            for (var id in data.items){
                
                arr.push(data.items[id]);
                $('#priceItem[idProduct="'+id+'"]').text(data.items[id].price+" VND");
                $('.checkbox[idProduct="'+id+'"]').attr("data-price",data.items[id].price)
                $('.checkbox[idProduct="'+id+'"]').attr("data-qty",data.items[id].qty)
                if($('.checkbox[idProduct="'+id+'"]').is(":checked")){
                    total += MakeInterger(data.items[id].price)  
                    var wrap = $("#listItem");
                    wrap.empty();
                    $('.checkbox:checked').each(function() {
                        //script them sp vao bang thong tin gio hang
                        var wrap = $("#listItem");
                        var rowHtml = $(document.createElement('div')).addClass("row").appendTo(wrap);
                        var detail = $(document.createElement('div')).addClass("col-6").appendTo(rowHtml);
                        var name = $(document.createElement('p')).addClass("size_info_total").attr("idProduct",$(this).attr('idProduct')).text($(this).attr('nameProduct')).appendTo(detail);
                        var qty = $(document.createElement('p')).text("x"+$(this).attr('data-qty')).appendTo(detail);
                        var price = $(document.createElement('p')).addClass("col-6").text($(this).attr('data-price')+" VND").appendTo(rowHtml);
                    });
                }   
            }  
            $('.size_info_total span').text(MakeDecimal(total)+" VND");   
        })
    }
    else{
        console.log("giam 1")
        console.log($(this).attr('idProduct'))
        $.ajax({
            type: 'GET',
            url: '/reduceByOne/'+$(this).attr('idProduct'),
        })
        .done(function(data){
            var arr = [];
            var total = 0;
            for (var id in data.items){   
                console.log(data)  
                console.log('adsd')
                arr.push(data.items[id]);
                $('#priceItem[idProduct="'+id+'"]').text(data.items[id].price+" VND");
                $('.checkbox[idProduct="'+id+'"]').attr("data-price",data.items[id].price)
                $('.checkbox[idProduct="'+id+'"]').attr("data-qty",data.items[id].qty)
                if($('.checkbox[idProduct="'+id+'"]').is(":checked")){
                    // $('.size_info_total span').text(data.items[id].price+" VND");  
                    total += MakeInterger(data.items[id].price)
                    var wrap = $("#listItem");
                    wrap.empty();
                    $('.checkbox:checked').each(function() {
                        //script them sp vao bang thong tin gio hang
                        var wrap = $("#listItem");
                        var rowHtml = $(document.createElement('div')).addClass("row").appendTo(wrap);
                        var detail = $(document.createElement('div')).addClass("col-6").appendTo(rowHtml);
                        var name = $(document.createElement('p')).addClass("size_info_total").attr("idProduct",$(this).attr('idProduct')).text($(this).attr('nameProduct')).appendTo(detail);
                        var qty = $(document.createElement('p')).text("x"+$(this).attr('data-qty')).appendTo(detail);
                        var price = $(document.createElement('p')).addClass("col-6").text($(this).attr('data-price')+" VND").appendTo(rowHtml);
                    });
                } 
            }
            $('.size_info_total span').text(MakeDecimal(total)+" VND");  
        })
        if(btn.closest('.number-spinner').find('input').val() == 0){
            // e.target.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove()
            $(this).parents('#productDisplay').remove()
            var wrap = $("#listItem");
            wrap.empty()
        }
    }
 
    
});

function MakeDecimal(Number) {
    Number = Number + "" // Convert Number to string if not
    Number = Number.split('').reverse().join(''); //Reverse string
    var Result = "";
    for (i = 0; i <= Number.length; i += 3) {
        Result = Result + Number.substring(i, i + 3) + ".";
    }
    Result = Result.split('').reverse().join(''); //Reverse again
    if (!isFinite(Result.substring(0, 1))) Result = Result.substring(1, Result.length); // Remove first dot, if have.
    if (!isFinite(Result.substring(0, 1))) Result = Result.substring(1, Result.length); // Remove first dot, if have.
    return Result;
}
function MakeInterger(Number)
{
    var string = Number.toString();
    var newStr = string.split('.').join('')
    return(parseInt(newStr))
}


