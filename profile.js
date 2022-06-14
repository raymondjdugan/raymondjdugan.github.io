const projectLink = document.getElementById('projectLink');
const dropdown = document.getElementById('dropdown');

const createDropDownHTML = (_) => {
	//language=HTML
	return `
        <div class="flex flex-col bg-white text-center lg:text-xl">
			<a class="hover:bg-slate-200 mx-2" href="https://thectoc.com:8080/" target="_blank">Clear To Close</a>
            <a class="hover:bg-slate-200 mx-2" href="weathermap/weather_map.html" target="_blank">Weather Map</a>
            <a class="hover:bg-slate-200 mx-2" href="bankist/index.html" target="_blank">Bankist Application</a>
            <a class="hover:bg-slate-200 mx-2" href="coffee-project/main.html" target="_blank">R&D Coffee</a>
            <a class="hover:bg-slate-200" href="movie-project/index.html" target="_blank">Movie Database</a>
			<a class="hover:bg-slate-200" href="https://goalsetterray.herokuapp.com/login" target="_blank">GoalSetter</a>
        </div>`;
};

window.addEventListener('click', (e) => {
	if (dropdown.childNodes.length === 0) {
		if (e.target.id === 'projectLink') {
			dropdown.insertAdjacentHTML('afterbegin', createDropDownHTML());
		}
	} else if (dropdown.childNodes.length === 2) {
		dropdown.innerHTML = '';
	}
});

$(document).click((_) => {});
