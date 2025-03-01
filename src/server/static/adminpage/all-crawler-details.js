/*
all-crawler-details.js
*/
const AllCrawlerDetails = ( () => {
    let _hots = [];
    let _mother;
    let _active_hot = 0;
    let fullCrawlerData;
    const _displayDataMapping = [
        ["mainData_name", "server_name"], 
        ["mainData_state", "crawling_state"],
        ["subData_percent", "percentage"],
        ["subData_infra", "infra_state"],
        ["subData_startTime", "start_time"],
    ];

    function _init(_mother_id){
        _mother = document.getElementById(_mother_id);
    }

    //all-crawler-details id에 상세 정보 표 생성
    document.addEventListener("DOMContentLoaded", function() {_init("all-crawler-details")});

    //_makeTable에서 subData를 만드는데 사용됨
    function _makeSubContent(num, title, contentId){
        const subData_something = document.createElement("div");
        subData_something.className = "me-4";

        const subData_something_title = document.createElement("span");
        subData_something_title.className = "badge bg-success bg-opacity-75 fs-6";
        subData_something_title.textContent = title;

        const subData_something_content = document.createElement("span");
        subData_something_content.id = `subData_${contentId}_${num}` //content id
        subData_something_content.className = "fw-bold fs-6";
        subData_something_content.textContent = "N/A";

        subData_something.appendChild(subData_something_title);
        subData_something.appendChild(subData_something_content);

        return subData_something;
    }

    //하나의 크롤러를 표현하는 box를 생성하고 _hots에 넣어줌
    function _makeBox(crawlerNum){
        //전체 내용을 담는 Box 요소 생성
        let newBox = document.createElement("div");
        newBox.id = `detailHolder + ${crawlerNum}`;
        newBox.className = "row align-items-md-stretch border bg-secondary bg-opacity-25 rounded-3 mt-3";
        newBox.style.margin = "10pt 20pt";
        
        //주요 정보 (크롤러 이름, 크롤러 상태, 진행률)
        const mainData = document.createElement("div");
        mainData.id = `detail-main-${crawlerNum}`;
        mainData.className = "d-flex align-items-center";
        mainData.style = "margin-top:7pt; margin-bottom:15pt;";

        //크롤러 이름
        const mainData_name = document.createElement("h4");
        mainData_name.style = "margin-right:15pt;";
        mainData_name.textContent = "크롤러 이름: ";

        const mainData_name_content = document.createElement("span");
        mainData_name_content.className = "badge bg-success bg-opacity-75 fs-6";
        mainData_name_content.id = `mainData_name_${crawlerNum}`; //이름 id
        mainData_name_content.textContent = "N/A";

        mainData_name.appendChild(mainData_name_content);
        mainData.appendChild(mainData_name);

        //크롤러 상태
        const mainData_state = document.createElement("h4");
        mainData_state.style = "margin-right:15pt;";
        mainData_state.textContent = "크롤러 상태: ";

        const mainData_state_content = document.createElement("span");
        mainData_state_content.className = "badge bg-success bg-opacity-75 fs-6";
        mainData_state_content.id = `mainData_state_${crawlerNum}`; //상태 id
        mainData_state_content.textContent = "N/A";

        mainData_state.appendChild(mainData_state_content);
        mainData.appendChild(mainData_state);

        //부가 정보 (진행률, 인프라 상태, 시작시간, passes, etc)
        const subDate = document.createElement("h6");
        subDate.className = "d-flex";

        //진행률
        const subData_percent = _makeSubContent(crawlerNum, "진행률:", "percent");
        //인프라 상태
        const subData_infraStane = _makeSubContent(crawlerNum, "인프라 상태:", "infra");
        //시작시간
        const subData_startTime = _makeSubContent(crawlerNum, "시작 시간:", "startTime");
        //passes
        const subData_passes = _makeSubContent(crawlerNum, "passes:", "passes");

        subDate.appendChild(subData_percent);
        subDate.appendChild(subData_infraStane);
        subDate.appendChild(subData_startTime);
        subDate.appendChild(subData_passes);

        //프로그래스 바
        const progressBar = document.createElement("div");
        progressBar.className = "col-md-12";
        progressBar.style = "margin:10pt 0pt";

        const progressBar_container = document.createElement("div");
        progressBar_container.className = "progress";
        
        const progressBar_content = document.createElement("div");
        progressBar_content.id = `progressBar_detail_${crawlerNum}`;//프로그래스 바 id
        progressBar_content.className = `progress-bar progress-bar-striped`;
        progressBar_content.style = "width = 10%";
        progressBar_content.role = "progressbar";

        progressBar_container.appendChild(progressBar_content);
        progressBar.appendChild(progressBar_container);

        //박스에 주요 정보, 부가 정보, 프로그래스 바를 등록
        newBox.appendChild(mainData);
        newBox.appendChild(subDate);
        newBox.appendChild(progressBar);

        _hots.push(newBox);
    }

    //하나의 항목을 업데이트함
    function _updateItem(targetId, crawlerNum, content){
        //console.log(`_updateTtem: ${targetId}, ${crawlerNum}, ${content}`);
        //$(`#${targetId}_${crawlerNum}`).textContent = content;
        const item = document.getElementById(`${targetId}_${crawlerNum}`);
        if (item){
            item.textContent = content;
        }
        else{
            console.log(`잘못된 id: ${targetId}_${crawlerNum}`);
        }
    }

    //fullCrawlerData를 바탕으로 _hots[crawlerNum] 항목을 업데이트함. 
    function _updateBox(crawlerNum){
        const detailData = fullCrawlerData[crawlerNum];
        
        //_updateItem("mainData_name", crawlerNum, detailData["server_name"]);
       _displayDataMapping.forEach((mappingData) => {
        _updateItem(mappingData[0], crawlerNum, detailData[mappingData[1]]);
       });

       _updateItem("subData_passes", crawlerNum, `${detailData["processed_passes"]}/${detailData["total_passes"]}`);

       //프로그래스 바 업데이트
       const bar = document.getElementById(`progressBar_detail_${crawlerNum}`);
       bar.style.width = `${~~detailData["percentage"]}%`;
       if (detailData["crawling_state"] === "working"){
        bar.classList.add("progress-bar-animated");
       }
       else{
        bar.classList.remove("progress-bar-animated");
       }
    }
    
    //carwler-list.js 에서 1초마다 호출해줌
    function fetch_and_display_data(){
        fullCrawlerData = CrawlerList.get_crawler_detail();
        let dataLength = fullCrawlerData.length;
        while (dataLength > _hots.length){//table이 부족한 경우 추가
            _makeBox(_hots.length) // _makeTable에서 _hots에 요소 추가
        }
        while (dataLength < _active_hot){//table이 너무 많이 활성화되어 있을 경우 삭제
            //_mother.removeChild(_hots[_active_hot-1]);
            _hots[_active_hot-1].remove();
            _active_hot -= 1;
        }
        while (_active_hot < dataLength){//dataLength까지 table 활성화
            _mother.appendChild(_hots[_active_hot]);
            _active_hot += 1;
        }
        for (let i = 0; i < _active_hot; i++){//활성화된 table update
            _updateBox(i);
        }
    }

    function fetch_and_display_state(){

    }

    const _exports = {
        fetch_and_display_state,
        fetch_and_display_data,
    };

    return _exports;

} )();