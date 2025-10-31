import {menuArray as menuArr} from './data.js' 

const checkout = document.getElementById('checkout')
const ratingStars = document.getElementsByTagName('i')
let foodItemsArr = []

// EventListener for checkout and adding/removing items to shopping basket
document.addEventListener('click', handleClicks)

function handleClicks(e) {
    if (e.target.dataset.addBtn){
        foodItemsArr.push(menuArr.filter((item) => {
            return item.id == e.target.dataset.addBtn
        })[0])

        renderCheckout()
        document.getElementById('checkout').style.display = 'block'
    }
    else if(e.target.dataset.remove){
        foodItemsArr = foodItemsArr.filter((item)=>{
            return item.id != e.target.dataset.remove
        })
        if(foodItemsArr.length === 0){
            document.getElementById('checkout').style.display = 'none'
        }
        renderCheckout()
        console.log(foodItemsArr)
    } 
    else if(e.target.id === 'checkout-btn'){
        document.querySelector('.payment-form').style.display = 'block'
        document.getElementById('checkout-btn').disabled = true
    }
}

// EventListener for pay-button
document.getElementById('payment-form').addEventListener('submit', (e)=>{
    e.preventDefault()
    const paymentModal = document.querySelector('.payment-form')
    const paymentForm = new FormData(document.getElementById('payment-information'))
    const firstName = paymentForm.get('customerName').split(' ')[0]
     
    paymentModal.innerHTML = getPaymentModalLoadingHtml()
    
    setTimeout(()=>{
        paymentModal.style.display = 'none'
        checkout.innerHTML = getPaymentSuccessHtml(firstName)
    },2000)

    document.removeEventListener('click',handleClicks)
})

function getPaymentModalLoadingHtml(){
    return `
    <div class="container-loading">
            <img src="images/loading.svg" class="loading">
            <p id="loading-text">Processing payment</p>
    </div>
    `
}

function getPaymentSuccessHtml(firstName){
    return `
    <div class="payment-success">
        <div class="payment-success-message-container">
            <p class="payment-success-message green">Thanks, ${firstName}! Your order is on its way.</p>
        </div>
        <p id="rate-experience" class="rate-experience">Please rate your experience.</p>
        <div class="rating-container">
            <span><i class="fa-regular fa-star" data-rating="1"></i></span>
            <span><i class="fa-regular fa-star" data-rating="2"></i></span>
            <span><i class="fa-regular fa-star" data-rating="3"></i></span>
            <span><i class="fa-regular fa-star" data-rating="4"></i></span>
            <span><i class="fa-regular fa-star" data-rating="5"></i></span>
        </div>
    </div>
    `
}

// EventListener for rating stars
document.addEventListener('click', handleRatingEvent)

function handleRatingEvent(e){
    if(e.target.dataset.rating){
        handleRatingStarClick(e.target.dataset.rating)
        document.removeEventListener('click',handleRatingEvent)
    }
}

function handleRatingStarClick(id){
    for(let i=0; i < Number(id); i++){
        ratingStars[i].classList.remove('fa-regular')
        ratingStars[i].classList.add('fa-solid')
    }
    document.getElementById('rate-experience').textContent = 'Thank you for your feedback!'
}

// functions to calculate items count, items price, total price
function calculateItemAmount(name){
    let amount = 0
    for(let item of foodItemsArr){
        if(item.name == name){
            amount++
        }
    }
    return amount
}

function calculateItemsPrice(item){
    return calculateItemAmount(item.name)*item.price
    
}

function calculateTotalPrice(){
    
    if(isDiscount()){
        return (foodItemsArr.reduce((total, item) => {
            return total + item.price
        }, 0)*0.85).toFixed(2)
    }
    else {
         return foodItemsArr.reduce((total, item) => {
            return total + item.price
        }, 0)
    }
}

// Function to check what items are in the shopping basket
function getDifferentItems(){
    const itemNameList=[]
    const itemList=[]
    for(let item of foodItemsArr){

        if(!itemNameList.includes(item.name)){
            itemList.push(item)
            itemNameList.push(item.name)
        }
    }
    return itemList
}

// Function to decide if a discount is given
function isDiscount(){
    let amountDrink=0
    let amountFood=0
    
    foodItemsArr.forEach((item)=>{
        if(item.type==="food"){
            amountFood++
        }
        else if(item.type==="drink"){
            amountDrink++
        }
    })
    return (amountFood >0)&&(amountDrink>0)
}

// Function to render the food items menu
function renderMenu(){
    
    const menuHtml = menuArr.map((menuItem) => {      
        const {name, ingredients, id, price, emoji} = menuItem
        return `
            <div class="menu-item">
                <div class="menu-information">
                    <p class="emoji">${emoji}<p>
                    <div>
                        <h4 class>${name}</h4>
                        <p class="ingredients">${ingredients.join(', ')}</p>
                        <h5 class="price">$${price}</h5>
                    </div>
                </div>
                <div class="btn-container">
                    <button class="add-item-btn" data-add-btn='${id}'>+</button>
                </div>
            </div>
        `
    }).join('')
    
    document.getElementById('food-menu').innerHTML = menuHtml
}

// Function to render the checkout section
function renderCheckout(){
    let checkoutHtml = ''
    
    checkoutHtml = `
    <div class="align-center your-order">
        <h4>Your order</h4>
    </div>
    `
   
    
    getDifferentItems().forEach((item)=>{

        checkoutHtml += `
        <div class="space-between item-container">
           <h4 class="item-checkout">${item.name} &nbsp x ${calculateItemAmount(item.name)} <span class="remove-item" data-remove='${item.id}'>(remove)</span></h4>
           <h5 class="item-checkout">$${calculateItemsPrice(item)}</h5> 
        </div>
        `
    })
    
    if(isDiscount()){
        checkoutHtml += `
        <div class="discount">
            <h6 class="green">Discount of 15% applied</h6>
        </div>
        `
    }
    
    checkoutHtml += `
    <div class="space-between total-price">
        <h4>Total price:</h4>
        <h5>$${calculateTotalPrice()}</h5>
    </div>
    <div class="checkout-btn-container">
        <button class="checkout-btn" id="checkout-btn">Complete order</button>
    </div>
    `
    
    checkout.innerHTML = checkoutHtml
}

renderMenu()

// EventListener that makes it so that input field cardNumber only accepts numbers. 
// Also adds a whitespace after every 4 numbers
document.getElementById("cardNumber").addEventListener("input", function (e) {
    this.value = this.value.replace(/[^0-9]/g, ""); // Removes non-numeric characters
    this.value = this.value.replace(/(.{4})/g, '$1 ').trim(); 
});

// EventListener that makes it so that input field cvv only accepts numbers.
document.getElementById("cvv").addEventListener("input", function (e) {
    this.value = this.value.replace(/[^0-9]/g, ""); // Removes non-numeric characters
});

