const $ul = document.querySelector(".list__item");
const $btn = document.querySelector(".button--add");
const $input = document.querySelector(".input--text");

const todos = [];

$btn.addEventListener("click", () => {
    todos.push($input.value);
    console.log(todos);
    const ss = todos.map((item)=>{
        return `<li>${item}</li>
        <button class="button--delete">삭제</button>`
    }).join("");
    console.log(ss)
    $ul.innerHTML = ss;

    document.querySelector(".button--delete").addEventListener("click",()=>{
        todos.
    });
});
