#input = batting team, bowling team , current score , wickets out , overs completed , target , venue
from fastapi import FastAPI,HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
import pickle 
from pydantic import BaseModel,Field,computed_field
from typing import Annotated,Literal
from fastapi.middleware.cors import CORSMiddleware
import sklearn

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ipl-probability-fastapi.vercel.app/"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open('pipe.pkl' , 'rb') as f:
    model = pickle.load(f)


class MatchInput(BaseModel):
    batting_team: Annotated[Literal['Sunrisers Hyderabad',
    'Mumbai Indians',
    'Royal Challengers Bangalore',
    'Kolkata Knight Riders',
    'Kings XI Punjab',
    'Chennai Super Kings',
    'Rajasthan Royals',
    'Delhi Capitals'] ,
                            Field(..., description="Name of the batting team")]
    
    
    
    bowling_team: Annotated[Literal['Sunrisers Hyderabad',
    'Mumbai Indians',
    'Royal Challengers Bangalore',
    'Kolkata Knight Riders',
    'Kings XI Punjab',
    'Chennai Super Kings',
    'Rajasthan Royals',
    'Delhi Capitals'], Field(..., description="Name of the bowling team")]
    
    
    
    
    current_score: Annotated[int, Field(..., ge=0, description="Current score of the batting team")]
    wickets_out: Annotated[int, Field(..., ge=0, le=10, description="Number of wickets fallen")]
    overs_completed: Annotated[float, Field(..., ge=0.0, le=20.0, description="Overs completed")]
    total_runs_x: Annotated[int, Field(..., ge=0, description="Target score to win the match")]
    
    
    city: Annotated[Literal['Hyderabad', 'Bangalore', 'Mumbai', 'Indore', 'Kolkata', 'Delhi',
       'Chandigarh', 'Jaipur', 'Chennai', 'Cape Town', 'Port Elizabeth',
       'Durban', 'Centurion', 'East London', 'Johannesburg', 'Kimberley',
       'Bloemfontein', 'Ahmedabad', 'Cuttack', 'Nagpur', 'Dharamsala',
       'Visakhapatnam', 'Pune', 'Raipur', 'Ranchi', 'Abu Dhabi',
       'Sharjah', 'Mohali', 'Bengaluru'], Field(..., description="Match city")]
    
    @computed_field
    @property
    def runs_left(self) -> int:
        return self.total_runs_x - self.current_score

    @computed_field
    @property
    def balls_left(self) -> int:
        return int(20 * 6 - self.overs_completed * 6)

    @computed_field
    @property
    def wickets(self) -> int:
        return 10 - self.wickets_out

    @computed_field
    @property
    def crr(self) -> float:
        return round(self.current_score / self.overs_completed, 2) if self.overs_completed > 0 else 0.0

    @computed_field
    @property
    def rrr(self) -> float:
        balls_left = self.balls_left
        return round((self.runs_left * 6) / balls_left, 2) if balls_left > 0 else float('inf')    


@app.post('/predict')
def predict(match : MatchInput):
    if match.batting_team == match.bowling_team:
        raise HTTPException(status_code=400, detail="Batting and Bowling teams cannot be the same.")
    input_df = pd.DataFrame([{
        'batting_team': match.batting_team,
        'bowling_team': match.bowling_team,
        'city': match.city,
        'runs_left': match.runs_left,
        'balls_left': match.balls_left,
        'wickets': match.wickets,
        'total_runs_x': match.total_runs_x,
        'crr': match.crr,
        'rrr': match.rrr
    }])
    print('df created')
    
    loss_prob, win_prob = model.predict_proba(input_df)[0]
    
    print(loss_prob,win_prob)
    
    
    return JSONResponse(status_code=200, content={
    "batting_team": match.batting_team,
    "batting_win_prob": f"{round(win_prob, 2) * 100}%",
    "bowling_team": match.bowling_team,
    "bowling_win_prob": f"{round(loss_prob, 2) * 100}%"
})

    