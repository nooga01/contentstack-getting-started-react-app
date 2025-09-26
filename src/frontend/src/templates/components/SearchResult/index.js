$(document).ready(function(){
    // Search result page
    const $SearchBtn = $(".search-result-section .search-bar .button");
    const $searchInput = $(".search-result-section .search-bar .search-input");
    const $searchSortSelect = $(".search-result-section .sorting-wrapper select");
	
    // When pressing Enter
    $searchInput.keyup(function (e) {
        e.preventDefault();
        if (e.key == "Enter" || e.keyCode == 13) {
			const sUrl = $(".search-result-section").data("url");
			const sParam = $(".search-result-section").data("param");
			const inputVal = $searchInput.val() || "";

			const separator = sUrl.includes("?") ? "&" : "?";
			const newUrl = `${sUrl}${separator}${sParam}=${inputVal}`;
			
			window.location.href = newUrl;
			return false;
        }
    });
	// When clicking Search button
    $SearchBtn.on("click", function () {
		const sUrl = $(".search-result-section").data("url");
		const sParam = $(".search-result-section").data("param");
		const inputVal = $searchInput.val() || "";

		const separator = sUrl.includes("?") ? "&" : "?";
		const newUrl = `${sUrl}${separator}${sParam}=${inputVal}`;
		
		window.location.href = newUrl;
		return false;
    });
    // When selecting a sorting option, will redirect to "/search#mainsearch_e=1&mainsearch_q=[USER INPUT]&mainsearch_o=[SELECTED SORT OPTION]"
	$searchSortSelect.on("change", function () {
		const sUrl = $(".search-result-section").data("url");
		const sParam = $(".search-result-section").data("param");
		const inputVal = $searchInput.val() || "";
		const sSort = $searchSortSelect.val()?.toLowerCase().replace(/ /g, "-");

		const separator = sUrl.includes("?") ? "&" : "?";
		const newUrl = `${sUrl}${separator}${sParam}=${inputVal}${sSort ? `&sort=${sSort}` : ''}`;

		window.location.href = newUrl;
		return false;
	});
})




