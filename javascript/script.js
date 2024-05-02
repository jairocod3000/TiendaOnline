import { Views } from "./views.js";
import {Controllers} from "./controllers.js";

const views = new Views();
const controllers = new Controllers();

emailjs.init('c2I8uIaHDDPg57Fj5');

const images = [
    "./img/carrousel/carrousel1.jpg",
    "./img/carrousel/carrousel2.jpg",
    "./img/carrousel/carrousel3.jpg",
    "./img/carrousel/carrousel4.jpg",
    "./img/carrousel/carrousel5.jpg",
    "./img/carrousel/carrousel6.jpg",
    "./img/carrousel/carrousel7.jpg",
];

var cart;

if(localStorage.getItem("cart") === null) {
    cart = [];
}
else {
    cart = JSON.parse(localStorage.getItem("cart"));
}

$(document).ready(function() {
    $(".container").text(controllers.changeToMainView(views));
    
    controllers.setIntervalForCarrousel(images);

    // Eventos que llevan a la vista principal

    $(document).on("click", ".logo", function() {
        controllers.changeToMainView(views);
    });


    // Eventos que llevan a la vista de todos los productos

    $(document).on("click", "#carrousel-img", function() {
        controllers.changeToAllProductsView(views);
    });

    $(document).on("click", "#banner_principal img", function() {
        controllers.changeToAllProductsView(views);
    });
    
    $(document).on("click", "#productsLink", function() {
        controllers.changeToAllProductsView(views);
    });

    $(document).on("click", "#seeAllProductsButton", function() {
        controllers.changeToAllProductsView(views);
    });


    // Eventos que llevan a la vista de productos por categoria
    
    $(document).on("click", "#woman", function() {
        controllers.changeViewsBetweenCategories("woman",views);
    });
    
    $(document).on("click", "#men", function() {
        controllers.changeViewsBetweenCategories("men", views);
    });
    
    $(document).on("click", "#jewlary-and-watches", function() {
        controllers.changeViewsBetweenCategories("jewlary-and-watches", views);
    });
    
    $(document).on("click", "#bags-and-shoes", function() {
        controllers.changeViewsBetweenCategories("bags-and-shoes", views);
    });
    
    $(document).on("click", "#computers", function() {
        controllers.changeViewsBetweenCategories("computers", views);
    });

    $(document).on("click", "#phone-and-tablets", function() {
        controllers.changeViewsBetweenCategories("phone-and-tablets", views);
    });

    $(document).on("click", "#tools-and-hardware", function() {
        controllers.changeViewsBetweenCategories("tools-and-hardware", views);
    });

    $(document).on("click", "#home-and-furniture", function() {
        controllers.changeViewsBetweenCategories("home-and-furniture", views);
    });

    // Cambiar el orden de los productos al pulsar el boton de ordenar

    $(document).on("click", ".sort--button", function() {
        let order = $("#sort").val();
        console.log(order);
        let categories = $("#categoryForSort").val();
        controllers.sortProducts(order, categories ,views);
    });
    

    // Evento que llevan a la vista de login y lo manejan, junto a los eventos de correo

    $(document).on("click", ".fa-user", function() {
        controllers.changeToLogIn(views);
    });

    $(document).on("submit", ".LI_form", function(e) {
        e.preventDefault();
        controllers.logIn();
    });

    $(document).on("submit", ".SU_form", function(e) {
        e.preventDefault();
        controllers.signUp();
    });

    $(document).on("click", "#activate_SU", function() {
        $("input:disabled").removeAttr("disabled");
        $(".SU_form button:disabled").removeAttr("disabled");
        $(".signup--container h1, .signup--container button, .signup--container p, .signup--container a").css("opacity", "1");
        $(".login--container h1, .login--container button, .login--container p, .login--container a").css("opacity", "0.3");
        $(".login--container input").attr("disabled", "disabled");
    });

    $(document).on("click", "#activate_LI", function() {
        $("input:disabled").removeAttr("disabled");
        $(".LI_form button:disabled").removeAttr("disabled");
        $(".login--container h1, .login--container button, .login--container p, .login--container a").css("opacity", "1");
        $(".signup--container h1, .signup--container button, .signup--container p, .signup--container a").css("opacity", "0.3");
        $(".signup--container input").attr("disabled", "disabled");
    });


    // Evento que llevan a la vista de producto

    $(document).on("click", ".product--img", function() {
        let name = $(this).siblings("#product--name--all-products").val();
        console.log(name);
        controllers.changeToProductView(views, name);
        
    });

    $(document).on("click", ".product--title", function() {
        let name = $(this).siblings("#product--name--all-products").val();
        controllers.changeToProductView(views, name);
    });

    $(document).on("click", "#cart--title--link", function() {
        let name = $(this).siblings("#product--name--cart").val();
        controllers.changeToProductView(views, name);
    });


    // Eventos que llevan a la vista de carrito y lo manejan

    $(document).on("click", ".add-to-cart", function() {
        let ID = $(this).siblings("#product--name--single-product").val();
        let size = $(this).siblings(".tallas").children(".size").val();

        fetch(`https://api.storerestapi.com/products/${ID}`)
            .then(res=>res.json())
            .then(json=>controllers.addProductToCart(json, size, cart));

        $(this).animate({"background-color": "green"}, 500);
        $(this).text("Añadido al carrito");
        $(this).effect("bounce", {times: 2}, 1000);
    });

    $(document).on("click", ".fa-shopping-cart", function() {
        controllers.changeToShoppingCart(views, cart);
    });

    $(document).on("click", ".fa-trash", function() {
        let ID = $(this).parents().siblings("#product--name--cart").val();
        $(this).parent().parent().fadeOut(500, function() {
            controllers.removeProductFromCart(ID, cart);
            controllers.changeToShoppingCart(views, cart);
        });
    });

    $(document).on("click", ".fa-arrows-rotate", function() {
        let ID = $(this).parents().siblings("#product--name--cart").val();
        let quantity = $(this).parents().siblings("#product--quantity").val();
        controllers.updateProductQuantity(ID, quantity, cart);
        controllers.changeToShoppingCart(views, cart);
    });

    $(document).on("click", ".buy", function() {
        controllers.changeToCheckout(views);
    });

    // Evento que lleva a la vista de checkout y lo maneja

    $(document).on("submit", ".checkout--form--container", function(e) {
        e.preventDefault();
        $("#buy--message").show(200);

        emailjs.sendForm('service_ysn82m8', 'template_x1zagzk', '.checkout--form--container')
    });

    // Evento para el menu hamburguesa

    $(document).on("click", ".hamburger-lines", function() {
        $(".checkbtn").toggleClass("open");
        $("body").toggleClass("fixed_position");
    });
    
    // Cerrar menu al pulsar enlace
    $(document).on("click", ".menu a", function() {
        $(".checkbtn").removeClass("open");
        $("body").removeClass("fixed_position");
    });

});