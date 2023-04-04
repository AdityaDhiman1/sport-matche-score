const express = require('express')
const app = express()
const port = 4000
const path = require("path")
const https = require("https")



app.set("view engine", "hbs")
let url = "https://api.cricapi.com/v1/currentMatches?apikey=665874a1-ded1-4355-920c-dbaca1e95f1e&offset=0"
app.use(express.static(path.join(__dirname, "public")))
app.get('/', (req, res) => {
    let isDisplay = false;
    let team = req.query.team_name;
    if (!team) {
        isDisplay = false;
    } else {
        isDisplay = true;
    }
    // console.log(team);
    https.get(url, (resp) => {
        let team_name = [];
        let body = "";
        try {
            resp.on("data", (chunk) => {
                body += chunk;
            })
            resp.on("end", () => {
                let api_data = JSON.parse(body);
                let team_info = api_data.data;
                // console.log(team_info.length);
                for (let team in team_info) {
                    // console.log(team_info[team].name);
                    team_name.push(team_info[team].name);
                }
                // console.log(team_name);
                let team1, team2, img1, img2;
                for (let selectTeam in team_info) {
                    if (team_info[selectTeam].name == team) {
                        // console.log(team_info[selectTeam].teamInfo);
                        for (let i = 0; i < 2; i++){
                            if (i == 0) {
                                team1 = team_info[selectTeam].teamInfo[i];
                                team1.rn = team_info[selectTeam].score[i].r;
                                team1.wk = team_info[selectTeam].score[i].w;
                                team1.ov = team_info[selectTeam].score[i].o;
                            } else {
                                team2 = team_info[selectTeam].teamInfo[i];
                                team2.rn = team_info[selectTeam].score[i].r;
                                team2.wk = team_info[selectTeam].score[1].w;
                                team2.ov = team_info[selectTeam].score[1].o;
                            }
                            // console.log(i);
                        }
                    }
                }
                if (team) {
                    img1 = team1.img;
                    img2 = team2.img;
                    delete team1.img;
                    delete team2.img;
                    
                }
                // console.log(team2)
                // console.log(team1)
                

                res.render('index',
                    {
                        team_names: team_name, isDisplay: isDisplay, team1: team1, team2: team2, img1: img1, img2:  img2                       
                    }
                )
            })
        } catch (err) {
            console.log(err);
        }
    }).on("error", (err) => {
        console.log(err)
    });
});


app.listen(port, () => console.log(`App listening on port ${port}!`))