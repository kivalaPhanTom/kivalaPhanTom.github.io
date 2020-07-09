
$(document).ready(function(){
    
    /*-------------- xử lý cho slide */
    $("#content-slider").lightSlider({
        
        auto:true,
        adaptiveHeight:true,
        item:1,
        slideMargin:0,
        loop:true
        
    });
    
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


    new WOW().init(); /*------------ kích hoạt wow.js*/


    //----------hàm xử lí khi click vào ô checkbox chọn tất cả
    $('.selectall').click(function() {
        var wrap = $("#listItem");
        wrap.empty();
        
        if ($(this).is(':checked')) {
            $('input:checkbox').prop('checked', true);
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


/* End Chức năng lọc sản phẩm theo tên hãng */

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
            url: 'http://localhost:3000/addByOne/'+$(this).attr('idProduct'),
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
            url: 'http://localhost:3000/reduceByOne/'+$(this).attr('idProduct'),
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


