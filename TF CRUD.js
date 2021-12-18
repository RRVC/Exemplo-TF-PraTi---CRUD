const registry = [[], []]; // Registry[0] armazena alunos enquanto Registry[1] armazena não-alunos.
const output = document.getElementsByClassName("list_container");
const out_registry = document.getElementsByClassName("registry_container");
const out_msg = document.getElementsByClassName("out_msg"); // out_msg[0] mostra mensagem de erros no cadastramento enquanto out_msg[1] mostra na alteração do cadastro;
const inputs = document.getElementsByClassName("input_field");
var edit_array;
var edit_id;

function signUp() {

    const user_category = document.querySelector('input[name="user_category"]:checked');
    let inputted_name = document.getElementById("name_input");
    let inputted_tel = document.getElementById("tel_input");
    let inputted_birth = document.getElementById("birth_input");
    let inputted_grade = document.getElementById("grade_input");

    if (user_category == null) {
        out_msg[0].innerHTML = `Escolha se já é aluno.`;
        return false;
    } else {
        if (validate(inputted_name.value, inputted_tel.value, inputted_birth.value, 0)) {

            var user = {
                name: inputted_name.value,
                tel: inputted_tel.value,
                birth: inputted_birth.value.replace(/^(\d{4})*-(\d{2})*-(\d{2})$/, "$3-$2-$1"),
                grade: user_category.value == 0 ? inputted_grade.value : "Não Aluno.",
                reg_date: reg_date(),
                reg_edit: reg_date()
            };

            if (user_category.value == 0) {
                registry[0].push(user);
                show(0);
            } else {
                registry[1].push(user);
                show(1);
            }
            out_msg[0].innerHTML = `${user.name} - Cadastrado(a) com sucesso!`;
            inputted_name.focus();
            unset_fields();
        };
    };
};

function validate(name, phone, birth, msg) {
    let regNum = /^[\d ,.-]+$/;
    let regTxt = /^[\D ]+$/;
    if (name.length == 0 || phone.length == 0 || birth.length == 0) {
        out_msg[msg].innerHTML = `Preencha todos os dados!`;
        return false;
    } else if (!regTxt.test(name)) {
        out_msg[msg].innerHTML = `Nome só pode conter letras!`;
        return false;
    } else if (!/^[\d -]+$/.test(phone) || !regNum.test(birth)) {
        out_msg[msg].innerHTML = `Telefone ou Nascimento só podem conter números!`;
        return false;
    } else if ((new Date().getFullYear() - new Date(birth).getFullYear() <= 11) || (new Date().getFullYear() - new Date(birth).getFullYear() > 100)) {
        out_msg[msg].innerHTML = `Nascimento inválido.<br>Valor min: 12 anos || Valor max: 100 anos`;
        return false;
    } else {
        out_msg[msg].innerHTML = ``;
        return true;
    };
};

function show(array) {
    if (registry[0].length == 0 && registry[1].length == 0) {
        document.getElementById("all_outputs_container").style.display = "none";
        out_msg[0].innerHTML = "";
    } else {
        registry[0].length == 0 ? out_registry[0].style.display = "none" : out_registry[0].style.display = "unset";
        registry[1].length == 0 ? out_registry[1].style.display = "none" : out_registry[1].style.display = "unset";
        var array_output = "";
        for (var index in registry[array]) {
            var id = parseInt(index);
            const del = `<input class="input_btn" type='button' value='Excluir cadastro' onclick='remove(${array},${id})'>`;
            const edit = `<input class="input_btn" type='button' value='Editar' onclick='edit_menu(${array},${id},"block")'>`;
            array_output += `<div class="user_container" id="user_${id}">
                    ID ${id}: <br>
                    Nome: ${registry[array][index].name}<br>
                    Telefone: ${registry[array][index].tel}<br>
                    Nascimento: ${registry[array][index].birth}<br>
                    Nota: ${registry[array][index].grade}<br>
                    Data de registro: ${registry[array][index].reg_date}<br>
                    Ultima edição: ${registry[array][index].reg_edit}<br>
                    <div class="btn_container">${edit} | ${del}</div>
                    </div>
                    `;
        };
        document.getElementById("all_outputs_container").style.display = "flex";
        if (array == 0) {
            output[0].innerHTML = array_output;
        } else {
            output[1].innerHTML = array_output;
        };
    };
};

function remove(array, id) {
        if (confirm(`Tem certeza que deseja remover ID ${Number(id)} - ${registry[array][id].name}?`)) {
            out_msg[0].innerHTML = "";
            registry[array].splice(parseInt(id), 1);
        };
    out_msg[0].innerHTML = "";
    show(array);
};

function reg_clear(array) {
    if (confirm("Tem certeza que deseja limpar registro?")) {
        registry[array].splice(0, registry[array].length);
        alert("Registro deletado");
        show(array);
    };
};

function edit() {
    let edit_inputs = document.getElementsByClassName("edit_input_fields");

    let edited_name = document.getElementById("edit_name_input");
    let edited_tel = document.getElementById("edit_tel_input");
    let edited_birth = document.getElementById("edit_birth_input");
    let edited_grade = document.getElementById("edit_grade_input");

    if (validate(edited_name.value, edited_tel.value, edited_birth.value, 1)) {
        registry[edit_array][edit_id].name = edited_name.value;
        registry[edit_array][edit_id].tel = edited_tel.value;
        registry[edit_array][edit_id].birth = edited_birth.value.replace(/^(\d{4})*-(\d{2})*-(\d{2})$/, "$3-$2-$1");;
        registry[edit_array][edit_id].grade = edited_grade.value;
        registry[edit_array][edit_id].reg_edit = reg_date();
        show(edit_array);
        edit_menu(null, null, 'none');
        for (var item of edit_inputs) {
            item.value = "";
        };
    };
};

function edit_menu(array, id, action) {
    out_msg[0].innerHTML = "";

    document.getElementById("edit").style.display = `${action}`;

    if (array == null || id == null) {
        return false;
    } else {
        document.getElementById("editing_user").innerHTML = `${registry[array][id].name}`;
        document.getElementById("edit_name_input").value = registry[array][id].name;
        document.getElementById("edit_tel_input").value = registry[array][id].tel;
        document.getElementById("edit_birth_input").value = registry[array][id].birth.replace(/^(\d{2})*-(\d{2})*-(\d{4})$/, "$3-$2-$1");

        edit_array = array;
        edit_id = id;
    }

};

function reg_date() {
    var date = new Date();

    function getZeros(value) {
        var newValue = (value < 10) ? "0" + value : value;
        return newValue;
    };
    calendar = `${getZeros(date.getDate())}/${getZeros(date.getMonth() + 1)}/${date.getFullYear()}`;
    timestamp = `${getZeros(date.getHours())}:${getZeros(date.getMinutes())}:${getZeros(date.getSeconds())}`;

    fullDate = `${calendar} às ${timestamp}`;

    return fullDate;
};

/* ================================================================================================================================================================================
=================================================================================== FUNÇÕES EXTRAS ================================================================================
=================================================================================================================================================================================== */

function set_rng() {
    let inputted_name = document.getElementById("name_input");
    let inputted_tel = document.getElementById("tel_input");
    let inputted_birth = document.getElementById("birth_input");
    let inputted_grade = document.getElementById("grade_input");

    function rng_name() {
        let name_list = [
            ["Miguel", "Arthur", "Heitor", "Helena", "Alice", "Theo", "Davi", "Laura", "Gabriel", "Gael", "Valentina", "João Miguel"],
            ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Ribeiro", "Martins"]
        ];
        let rng1 = Math.floor(Math.random() * 12);
        let rng2 = Math.floor(Math.random() * 12);
        return `${name_list[0][rng1]} ${name_list[1][rng2]}`;
    };
    function rng_phone() {
        let rng_number = '9 9';
        for (var c = 0; c < 7; c++) {
            rng_number += Math.floor(Math.random() * 9);
        };
        return rng_number;
    };
    function rng_birth() {
        let rng_date = new Date((new Date()) - Math.floor(Math.random() * 1639520144665));
        function hasZero(value) {
            result = value < 10 ? "0" + value : value;
            return result;
        };
        let rng_birth = `${rng_date.getFullYear()}-${hasZero(rng_date.getMonth() + 1)}-${hasZero(rng_date.getDate())}`;
        return rng_birth;
    };
    inputted_name.value = rng_name();
    inputted_tel.value = rng_phone();
    inputted_birth.value = rng_birth();
    inputted_grade.value = (1 + Math.random() * (10 - 1)).toFixed(1);
};

function unset_fields() {
    for (var item of inputs) {
        item.value = "";
    };
};