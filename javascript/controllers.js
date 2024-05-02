export class Controllers{

    changeToMainView(views) {
        views.mainView();
    }
    
    setIntervalForCarrousel(images){
        let currentIndex = 0;
        let interval = setInterval(function() {;
            currentIndex++;
            if (currentIndex >= images.length) {
                currentIndex = 0;
            }
            $("#carrousel-img").fadeOut(1000, function() {
                $(this).attr("src", images[currentIndex]);
                $(this).fadeIn(1000);
            });
        }, 5000);
    }
    

    changeViewsBetweenCategories(category, views, order="asc") {
        if(category == "woman"){
            var RealCategory = "womens-fashion";
        } else if(category == "men"){
            var RealCategory = "mens-fashion";
        } else if(category == "jewlary-and-watches"){
            var RealCategory = "jewlary-and-watches";
        } else if(category == "bags-and-shoes"){
            var RealCategory = "bags-and-shoes";
        } else if(category == "computers"){
            var RealCategory = "computers"
        } else if(category == "phone-and-tablets"){
            var RealCategory = "phone-and-tablets"
        } else if(category == "tools-and-hardware"){
            var RealCategory = "tools-and-hardware"
        } else if(category == "home-and-furniture"){
            var RealCategory = "home-and-furniture"
        }

        $(".container").css({
            "opacity": "0.1",
            "pointer-events": "none",
        });
        $(".lds-ring").css("display", "inline-block");

        fetch(`https://api.storerestapi.com/categories/${RealCategory}`)
            .then(res=>res.json())
            .then(json=> {
                if (order === "asc") {
                    json.data.products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                } else if (order === "desc") {
                    json.data.products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                }

                views.productsView(json, category, RealCategory);
            });

    }
    
    
    changeToAllProductsView(views, order="asc") {
        $(".container").css({
            "opacity": "0.1",
            "pointer-events": "none",
        });
        $(".lds-ring").css("display", "inline-block");

        fetch(`https://api.storerestapi.com/products`)
                .then(res=>res.json())
                .then(json=> {
                    if (order === "asc") {
                        json.data.products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                    } else if (order === "desc") {
                        json.data.products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                    }

                    views.productsView(json);
                });
    }
    
    changeToProductView(views, name) {
        $(".container").css({
            "opacity": "0.1",
            "pointer-events": "none",
        });
        $(".lds-ring").css("display", "inline-block");

        fetch(`https://api.storerestapi.com/products/${name}`)
                .then(res=>res.json())
                .then(json=>views.singleProductView(json))
    }

    sortProducts(order, category, views) {
        if(category=="all"){
            this.changeToAllProductsView(views, order);
        } else {
            console.log(category);
            this.changeViewsBetweenCategories(category, views, order)
        }
    }
    
    changeToLogIn(views) {
        views.logInView();
    }
    
    addProductToCart(product, size, cart) {
        let createdProduct = {
            id: product._id,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            size: size,
            quantity: 1
        }
    
        let productExists = false;
    
        cart.forEach(function(productInCart) {
            if(productInCart._id == createdProduct._id && productInCart.size == createdProduct.size){
                productInCart.quantity++;
                productExists = true;
            }
        });
    
        if(!productExists){
            cart.push(createdProduct);
        }
    
        localStorage.cart = JSON.stringify(cart);
    }
    
    removeProductFromCart(ID, cart) {
        cart.forEach(function(productInCart, index) {
            if(productInCart._id == ID){
                cart.splice(index, 1);
            }
        });
    
        localStorage.cart = JSON.stringify(cart);
    }
    
    updateProductQuantity(ID, quantity, cart) {
        cart.forEach(function(productInCart) {
            if(productInCart._id == ID){
                productInCart.quantity = quantity;
            }
        });
    
        localStorage.cart = JSON.stringify(cart);
    }
    
    signUp(){
        fetch('https://api.storerestapi.com/users',{
            method: 'POST',
            body: JSON.stringify({
                name: 'Ron Bin Nawaz',
                email: 'ron@gmail.com',
                number: 72342341,
                password: 'pass12345',
                password_repeat: 'pass12345'
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then(res=>res.json())
            .then(json=> this.signUpHandler(json));
    }

    logIn(){
        fetch('https://api.storerestapi.com/users')
            .then(res=>res.json())
            .then(json=>this.logInHandler(json));
    }

    newsLetterSuscription(){
        $("#NL--message").show(200);
    }
    
    changeToShoppingCart(views, cart) {
        views.cartView(cart);
    }

    changeToCheckout(views){
        views.checkoutView();
    }

    changeToPayment(views){
        views.paymentView();
    }

    signUpHandler(json){
        if(json._id == 1 || json._id == 11){
            $("#signup--message").show(200);
        }

        emailjs.sendForm('service_ysn82m8', 'template_zn2sbrr', '.SU_form')
    }

    logInHandler(json){
        let user = json.find(user => user.username == $("#LI_username").val() && user.password == $("#LI_psw").val());
        if(user){
            $("#login--message").show(200);
        } else {
            $("#login--error").show(200);
        }
    }

}