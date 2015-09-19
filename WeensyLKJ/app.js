var API_KEY = "24d2095f-cf69-4825-b333-d1f126105016"; //This is MY API key. 

function summonerLookUp() {
    "use strict";
    var summonerLevel, REGION, SUMMONER_NAME, SUMMONER_NAME_CLEANED, URL, summonerID, summonerIcon;
    
    REGION = $("#region").val();
    REGION = REGION.toLowerCase();
    SUMMONER_NAME = $("#summoner").val();
    SUMMONER_NAME_CLEANED = SUMMONER_NAME.replace(" ", "");
    SUMMONER_NAME_CLEANED = SUMMONER_NAME_CLEANED.toLowerCase().replace(/\s+/g, '');
    
    document.getElementById("o_icon").innerHTML="";
    document.getElementById("o_error").innerHTML = "";
    document.getElementById("o_name").innerHTML = "";
    document.getElementById("o_rank").innerHTML = "";

    
    URL =  'https://' + REGION + '.api.pvp.net/api/lol/' + REGION + '/v1.4/summoner/by-name/' + SUMMONER_NAME + '?api_key=' + API_KEY;

    if (SUMMONER_NAME !== "") {

        $.ajax({
            url: URL,
            type: 'GET',
            dataType: 'json',
            data: {

            },
            success: function (json) {
                summonerID = json[SUMMONER_NAME_CLEANED].id;
                summonerLevel = json[SUMMONER_NAME_CLEANED].summonerLevel;
                summonerIcon = json[SUMMONER_NAME_CLEANED].profileIconId;
                if (summonerLevel < 30) {
                    document.getElementById("o_error").innerHTML = "Summoner is not level 30 yet!";
                } else {rankLookUp(REGION, summonerID, summonerIcon); }

            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                
                switch (XMLHttpRequest.status) {
                    case 401:   
                        document.getElementById("o_error").innerHTML = "Invalid or out of date API key (whoops)";
                        break;
                    case 404:   
                        document.getElementById("o_error").innerHTML = "Summoner doesn't exist!";
                        break;
                    case 500:   
                        document.getElementById("o_error").innerHTML = "Rate limit exceeded (whoops)";
                        break;
                    default:
                        document.getElementById("o_error").innerHTML = "Error " + XMLHttpRequest.status;
                }

            }
        });
    }
}

function rankLookUp(region, sumID, sumIcon) {
    "use strict";
    var URL2, summonerName, summonerTier, summonerDivision, summonerLP;

    URL2 = 'https://' + region + '.api.pvp.net/api/lol/' + region + '/v2.5/league/by-summoner/' + sumID + '/entry?api_key=' + API_KEY;
    //document.getElementById("o_response2").innerHTML = URL2;
    $.ajax({
        url: URL2,
        type: 'GET',
        dataType: 'json',
        data: {

        },
        success: function (json) {
            
            summonerName = json[sumID]['0']['entries']['0']['playerOrTeamName'];
            summonerTier = json[sumID]['0']['tier'];
            summonerDivision = json[sumID]['0']['entries']['0']['division'];
            summonerLP = json[sumID]['0']['entries']['0']['leaguePoints'];
        
            document.getElementById("o_name").innerHTML = summonerName;
            document.getElementById("o_rank").innerHTML = summonerTier + ' ' + summonerDivision + ' ' + summonerLP + ' LP';
            var img = document.createElement("img");
            img.src = "http://ddragon.leagueoflegends.com/cdn/5.18.1/img/profileicon/" + sumIcon + ".png";
            document.getElementById("o_icon").appendChild(img);
            //document.getElementById("o_response2").innerHTML = URL2;
            //document.getElementById("o_response2").innerHTML = JSON.stringify(json);
            
            
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            document.getElementById("o_error").innerHTML = "Summoner is unranked!";

        }
    });
        
}