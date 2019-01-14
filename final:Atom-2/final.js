
var monoesblog = {};

//クラスの追加
monoesblog.calendarCtrl = function(calendarDiv,startDay,chooseDateCaption,cellClickHandler){

  //選択されている日付オブジェクトを返すメソッド
    this.getChooseDate  = function () { return this.choosedDate;}
    this.getBaseDivName = function (){ return calendarDiv;}

//--- 実際の処理
    //カレンダーを表示するための table タグを主力
    this.renderGrid(calendarDiv);
    //カレンダーを描画
    this.renderCalendar(calendarDiv + "_fDay", startDay,cellClickHandler);
   //カレンダーの表示月の移動矢印のハンドラ設定
    this.setMoveMonthHandler(this);

  //選択された日付に対してキャプションが指定されていれば
  document.getElementById(calendarDiv + "_captionSpan").innerText= (chooseDateCaption)?chooseDateCaption: "　　　　　　";
}

   //カレンダーを描画
   monoesblog.calendarCtrl.prototype.renderCalendar  = function (tdID, currentDay, dayClickHandler) {
       var todaySelectedFlg = false;
       var this_calendar = this;
       var baseDivName = this_calendar.getBaseDivName();
       var lastWeekTR = document.getElementById(baseDivName + "_fLastWeek");
       lastWeekTR.style.visibility = "visible";
       var currentYear = currentDay.getFullYear();
       var currentMonth = currentDay.getMonth() + 1;

       this.choose_from_date = currentDay;

       //カレンダー上に月を表示
       document.getElementById(baseDivName + "_fMonth").innerText = currentYear
            + " 年 " + currentMonth + "月";

       var startDate = new Date(currentYear + "/" + currentMonth + "/1");

       this.current_fYear = Number(currentYear);
       this.current_fMonth = Number(currentMonth);

       startDate = this.calcDate(startDate, 0 - startDate.getDay());

       for (var i = 1; i <= 42; i++) {
            var dayDiv = document.getElementById(tdID + i);
            dayDiv.innerText = startDate.getDate();
            dayDiv.style.color = "black";
            dayDiv.setAttribute("tapDate", startDate.toString());
            dayDiv.setAttribute("tabindex", 0);
            dayDiv.onclick = function () { this_calendar.chooseDate(this, this_calendar); }

             //外部からのイベントハンドラが指定されていたら
             if(dayClickHandler){
	dayDiv.addEventListener("click",
            	    function () {
		dayClickHandler(new Date(this.getAttribute("tapDate")));
            	    }, false);
	}
                dayDiv.onkeydown = function (e) { if (e.keyCode == 13) {this_calendar.chooseDate(this, this_calendar);this.click(); }}

            //今日の日付を選択
            if (!todaySelectedFlg) {
                if (currentDay.getFullYear() == startDate.getFullYear()
                    && currentDay.getMonth() == startDate.getMonth()
                    && currentDay.getDate() == startDate.getDate())
                { this.chooseDate(dayDiv, this); }
            }
            if ((startDate.getMonth() + 1) != currentMonth) {
                //先月と翌月の日付の色
                dayDiv.style.backgroundColor = "gainsboro";
                if (i == 36) {
                    //最終週行の調整
                    lastWeekTR.style.visibility = "hidden";
                    break;
                }
            }
            else if (startDate.getDay() == 0)
            {  dayDiv.style.backgroundColor = "#f69";  } //日曜日の色
            else if (startDate.getDay() == 6)
            {   dayDiv.style.backgroundColor = "#9cf"; } //土曜日の色
            else {  dayDiv.style.backgroundColor = "#ffc"; }
            startDate = this.calcDate(startDate, 1);
        }
    }

 //カレンダーの日付を選択
   monoesblog.calendarCtrl.prototype.chooseDate =  function (tdDiv, this_calendar) {
        var dayOfWeekArray = ["日", "月", "火", "水", "木", "金", "土"];
        var baseDivName = this_calendar.getBaseDivName();
        tdDiv.style.border = "solid 3px blue";
        var prev_fdate = this_calendar.prev_fdate;
        if (prev_fdate && tdDiv != prev_fdate){ prev_fdate.style.border = ""; }
        this_calendar.prev_fdate = tdDiv;
        var gDate = new Date(tdDiv.getAttribute("tapDate"));
        this_calendar.choose_from_date = gDate;
        document.getElementById(baseDivName + "_chooseDate").innerText = this.formatDate_JP(gDate) + "(" + dayOfWeekArray[gDate.getDay()] + ")";
        //選択された日付を返す
        this_calendar.choosedDate = gDate;
    }

     //カレンダーの月移動
    monoesblog.calendarCtrl.prototype.moveMonth = function (ctrl ,this_calendar) {
        var changedYear = 0;
        var changedMonth = 0;
        var ctrlID = ctrl.id;
        var baseDivName = this_calendar.getBaseDivName();
        var previouseID = baseDivName + "_f_prv";
        var nextID = baseDivName + "_f_next";
        var current_fMonth  = this_calendar.current_fMonth;
        var current_fYear  = this_calendar.current_fYear;
        var prev_fdate =  this_calendar.prev_fdate;

        switch (ctrlID) {
            case previouseID:
                if (current_fMonth == 1)
                { changedMonth = 12; changedYear = current_fYear - 1 }
                else {
                    changedMonth = current_fMonth - 1; changedYear = current_fYear;
                }
                break;
            case nextID:
                if (current_fMonth == 12)
                { changedMonth = 1; changedYear = current_fYear + 1 }
                else {
                    changedMonth = current_fMonth + 1; changedYear = current_fYear;
                }
                break;
        }
        var changedDate = new Date(changedYear.toString() + "/" + changedMonth + "/1");
        this_calendar.renderCalendar(baseDivName + "_fDay", changedDate);

        if (prev_fdate)
        { prev_fdate.style.border = ""; }
    }


    //カレンダーの月移動のイベント設定
   monoesblog.calendarCtrl.prototype.setMoveMonthHandler = function(this_calendar) {
        var baseDivName = this_calendar.getBaseDivName();
        var fPrv = document.getElementById(baseDivName + "_f_prv");
        var fNext = document.getElementById(baseDivName + "_f_next");
        fPrv.onclick = function () { this_calendar.moveMonth(this,this_calendar); };
        fPrv.onkeydown = function (e) { if (e.keyCode == 13) this_calendar.moveMonth(this,this_calendar); };
        fNext.onclick = function () { this_calendar.moveMonth(this,this_calendar); };
        fNext.onkeydown = function (e) { if (e.keyCode == 13) this_calendar.moveMonth(this,this_calendar); };
    }


    //日付を計算する
    monoesblog.calendarCtrl.prototype.calcDate =  function (dt, addDay)
     {
            var baseSec = dt.getTime();
            var addSec = addDay * 86400000;
            var targetSec = baseSec + addSec;
            dt.setTime(targetSec);
            return dt;
    }


    //日付を年月日に
    monoesblog.calendarCtrl.prototype.formatDate_JP =  function (dateObj)
    {
         return dateObj.getFullYear() + "年"
                 + (dateObj.getMonth() + 1) + "月"
                 + dateObj.getDate() + "日";
     }


//カレンダーを表示すめための table タグを出力する
monoesblog.calendarCtrl.prototype.renderGrid =  function (CalendarAreaID)
{
    var area = document.getElementById(CalendarAreaID);
    var captionDiv = document.createElement("div");
    captionDiv.setAttribute("class", "caption");
    var captionSpan = document.createElement("span");
    captionSpan.setAttribute("id", CalendarAreaID + "_captionSpan");
    captionSpan.setAttribute("class", "chooseDateCaption");
    captionDiv.appendChild(captionSpan);
    var dateSpan = document.createElement("span");
    dateSpan.setAttribute("id", CalendarAreaID + "_chooseDate");
    dateSpan.setAttribute("class", "chooseDateCaption");
    captionDiv.appendChild(dateSpan);
    area.appendChild(captionDiv);

    var CalendarGrid =  document.createElement("table");
    CalendarGrid.setAttribute("tabindex", "0");
    var navTR = document.createElement("tr");
    var prvTD = document.createElement("td");
    prvTD.setAttribute("id", CalendarAreaID + "_f_prv");
    prvTD.setAttribute("tabindex", "0");
    prvTD.innerHTML = "&lt;&lt;";
    navTR.appendChild(prvTD);

    var monthDiv =  document.createElement("td");
    monthDiv.setAttribute("id", CalendarAreaID + "_fMonth");
    monthDiv.setAttribute("colspan", "5");
    monthDiv.setAttribute("class", "currentMonthCaption");
    navTR.appendChild(monthDiv);

    var nextTD = document.createElement("td");
    nextTD.setAttribute("id", CalendarAreaID + "_f_next");
    nextTD.setAttribute("tabindex", "0");
    nextTD.innerHTML = "&gt;&gt;";
    navTR.appendChild(nextTD);

    CalendarGrid.appendChild(navTR);
    var weekTR = document.createElement("tr");
    var dayOfWeekArray = ["日", "月", "火", "水", "木", "金", "土"];

    for (var i = 0; i < 7; i++) {
        var weekTD = document.createElement("td");
        weekTD.setAttribute("class", "dWeek");
        weekTD.innerText = dayOfWeekArray[i];
        weekTR.appendChild(weekTD);
     }
     CalendarGrid.appendChild(weekTR);
     var cellIndex = 1;

     for (var i = 0; i < 6; i++)
    {
          var dayTR = document.createElement("tr");
          if(i==5){
	dayTR.setAttribute("id", CalendarAreaID + "_fLastWeek");
          }
          for (var i2 = 0; i2 < 7; i2++)
          {
	var dayTD = document.createElement("td");
                dayTD.setAttribute("id", CalendarAreaID + "_fDay" + cellIndex);
	dayTD.setAttribute("class", "dayCell");
                dayTD.innerText = cellIndex;
                dayTR.appendChild(dayTD);
                cellIndex++;
          }
         CalendarGrid.appendChild(dayTR);
     }
     area.appendChild(CalendarGrid);
}
