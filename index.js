//전역변수 설정

let change_money = 0;
let total_money = 0;

//전역 객체 생성

let cola = {
    Original_Cola : {price: 1000, count: 3, sellcount: 1},
    Orange_Cola : {price: 1000, count: 5, sellcount: 1},
    Violet_Cola : {price: 1000, count: 0, sellcount: 1},
    Green_Cola : {price: 1000, count: 7, sellcount: 1},
    Cool_Cola : {price: 1000, count: 2, sellcount: 1},
    Yellow_Cola : {price: 1000, count: 10, sellcount: 1}    
}

// 입금 시 숫자에 , 추가

const $input = document.getElementById('enter_money')

$input.addEventListener('keyup', function(e){
    const $current = document.getElementById("have_money");
    let money = e.target.value
    money = Number(money.replaceAll(',',''))
    let current_money= Number($current.value.replace("원","").replace(",",""))
    if(money > current_money){
        $input.value=""
        alert("소지금이 부족해요 ㅠㅠ")
    }
    else{
        const krmoney = money.toLocaleString('ko-KR');
        $input.value = krmoney;
    }
})

// 입금 버튼 실행

const $deposit_button = document.getElementById("enter_button");

$deposit_button.addEventListener("click", function(){
    //변수 선언
    const $current = document.getElementById("have_money");
    const $changes = document.getElementById("changes");
    const $deposit = document.getElementById("enter_money");

    if($deposit.value === ""){
        alert("돈을 넣어주세요!")
        return;
    }
    
    else{
        //문자 숫자화
        $current.value = $current.value.replace("원","").replace(",","")
        $changes.value = $changes.value.replace("원","").replace(",","")
        $deposit.value = $deposit.value.replace("원","").replace(",","")
        
        //잔액 계산 실행
        $changes.value = parseInt($changes.value) + parseInt($deposit.value);
        change_money = $changes.value
        let change_value = Number($changes.value)
        const change_kr = change_value.toLocaleString('ko-KR');
        $changes.value = change_kr + "원";
    
        //소지금 계산 실행
        $current.value = parseInt($current.value) - parseInt($deposit.value)
        let current_value = Number($current.value)
        const curret_kr = current_value.toLocaleString('ko-KR');
        $current.value = curret_kr + "원"
        $deposit.value = "";
    }
})

//구매 목록 추가

const $machine = document.getElementById("machine");

$machine.addEventListener("click", function(e){
    // 변수선언
    const $changes = document.getElementById("changes");
    const $sell_area = document.getElementById("sell_area")
    const {name, price, url} = e.target.dataset;
    if(change_money == 0){
        //잔액이 0일 경우 클릭 이벤트 일어나지 않음
        alert("잔액 부족!")
        return;
    }
    else{
        if(cola[name].count == 0){
            //수량 확인
            alert("수량 부족!")
            }
        else{
            //HTML요소 삽입
            if(cola[name].sellcount == 1){
            //name을 가진 cola의 첫 번째 클릭 시
                $sell_area.insertAdjacentHTML('afterbegin', `<li class="gain ${url} sell" data-name=${name} data-url=${url} data-price=${price} data-count=${cola[name].sellcount}>${name}</li>`)
            }
            else{
                //두 번 이상 눌린 cola의 경우
                for(let i = 0; i<($sell_area.childNodes.length); i++){
                    if($sell_area.childNodes[i].textContent === name){
                        document.getElementsByClassName('sell')[0].dataset.count = parseInt(document.getElementsByClassName('sell')[0].dataset.count) + 1;
                    }
                }
            }
            //변수 정리
            cola[name].count -= 1
            cola[name].sellcount += 1
            change_money -= price
            $changes.value = change_money
            let change_value_2 = Number($changes.value)
            const change_kr_2 = change_value_2.toLocaleString('ko-KR');
            $changes.value = change_kr_2 + "원";
        }
        if(cola[name].count == 0){
            //품절 표시
            let styleEm = document.head.appendChild(document.createElement("style"))
            styleEm.innerHTML = `.${e.target.classList[1]}:before {content : ''}`
        }
    }
})

//거스름돈 반환

const $changes_button = document.getElementById("money_back");

$changes_button.addEventListener("click", function(){
    //변수 선언
    const $current = document.getElementById("have_money");
    const $changes = document.getElementById("changes");

    //문자 숫자화
    $current.value = $current.value.replace("원","").replace(",","")
    $changes.value = $changes.value.replace("원","").replace(",","")

    //계산
    $current.value = parseInt($changes.value) + parseInt($current.value);
    let current_value = Number($current.value)
    const curret_kr = current_value.toLocaleString('ko-KR');
    $current.value = curret_kr + "원"
    $changes.value = "0원"
    change_money = 0
})

//획득 버튼 활성화

const $obtain_button = document.getElementById("obtain");

$obtain_button.addEventListener("click", function(){
    //변수 선언
    const $gain_area = document.getElementById("gain_area")
    const $sell_area = document.getElementById("sell_area")
    
    //획득 구간으로 넘기기
    for(let j = 0; j<$sell_area.childNodes.length; j++){
        const {name, url, price, count} = $sell_area.childNodes[j].dataset       
        $gain_area.insertAdjacentHTML('afterbegin', `<li class="gain ${url} sum" data-count=${count}>${name}</li>`)

        //이미 있는 목록일 경우 갯수만 증가
        for(let i = 1; i<$gain_area.childNodes.length; i++){
            if($gain_area.childNodes[i].textContent === name){
                $gain_area.childNodes[i].dataset.count = parseInt(count) + parseInt($gain_area.childNodes[i].dataset.count)
                $gain_area.removeChild($gain_area.firstChild);
            }
        }

        //총금액 계산, 콜라 팔린 갯수 초기화
        total_money += Number(price) * Number(count)
        cola[name].sellcount = 1;
    }

    //sell_area 초기화
    while($sell_area.hasChildNodes()){
        $sell_area.removeChild($sell_area.firstChild);
    }

    //총금액 산출
    const $total_money = document.getElementById("after_section")
    let total_value = Number(total_money)
    const total = total_value.toLocaleString('ko-KR');
    $total_money.dataset.total = `총금액: ${total}원`
})


