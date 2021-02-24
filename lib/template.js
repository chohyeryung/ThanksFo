module.exports = {
    DIARY:function(diary){
        let list='<ul>';
        var i=0;
        while(i < diary.length) {
            list+=`<li>${diary[i].created}</li>`;
            list+=`<li>${diary[i].description1}</li>`;
            list+=`<li>${diary[i].description2}</li>`;
            list+=`<li>${diary[i].description3}</li>`;
            i+=1;
        }
        list=list+'</ul>';
        return list;
    }
}