let isCollapsed = true;
let isDarkMode = true;

// Инициализация Ace Editor
const editor = ace.edit("jsonEditor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/json");
editor.session.setUseWorker(true); // Включает проверку ошибок
editor.setValue(`{
"название": "Пример",
"статус": "Активный",
"данные": {
"идентификатор": 123,
"значения": [1, 2, 3]
}
}`, -1);

// Подсветка ошибок в JSON
editor.session.on("changeAnnotation", function() {
    const annotations = editor.session.getAnnotations();
    if (annotations.length > 0) {
        console.warn("Ошибка в JSON: ", annotations);
    }
});

// Автоформатирование JSON перед отображением
function formatJSON() {
    try {
        let jsonText = editor.getValue();
        let jsonData = JSON.parse(jsonText);
        let formattedJson = JSON.stringify(jsonData, null, 4);
        editor.setValue(formattedJson, -1);
    } catch (e) {
        alert("Ошибка форматирования JSON: " + e.message);
    }
}

// Обработчик кнопки рендеринга JSON
$("#renderJson").click(function() {
    formatJSON();
    let jsonText = editor.getValue() || document.getElementById("jsonInput").value;
    try {
        let jsonData = JSON.parse(jsonText);
        $("#jsonOutput").jsonViewer(jsonData, { collapsed: isCollapsed });
    } catch (e) {
        alert("Ошибка: Неверный формат JSON!");
    }
});

// Обработчик загрузки JSON-файла
document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            editor.setValue(e.target.result, -1);
            document.getElementById("jsonInput").value = e.target.result;
        };
        reader.readAsText(file);
    }
});

// Кнопка "Свернуть/Развернуть JSON"
$("#toggleJson").click(function() {
    isCollapsed = !isCollapsed;
    $("#renderJson").click();
});

// Кнопка "Копировать JSON"
$("#copyJson").click(function() {
    const jsonText = editor.getValue();
    navigator.clipboard.writeText(jsonText).then(() => {
        alert("JSON скопирован в буфер обмена!");
    }, () => {
        alert("Ошибка копирования JSON!");
    });
});

// Кнопка "Переключить тему" (теперь влияет и на jsonOutput)
$("#toggleTheme").click(function() {
    isDarkMode = !isDarkMode;
    editor.setTheme(isDarkMode ? "ace/theme/monokai" : "ace/theme/github");
    $("#jsonOutput").toggleClass("dark-mode light-mode");
});