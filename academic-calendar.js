// StudentOS academic calendar primitives.
// Keep official exam dates empty until RUAS publishes the academic/exam calendar.
const PERIODS=[
 {id:1,start:'08:15',end:'09:05',label:'Period 1'},
 {id:2,start:'09:05',end:'09:55',label:'Period 2'},
 {id:3,start:'09:55',end:'10:45',label:'Period 3'},
 {id:4,start:'11:15',end:'12:05',label:'Period 4'},
 {id:5,start:'12:05',end:'12:55',label:'Period 5'},
 {id:6,start:'12:55',end:'13:45',label:'Period 6'},
 {id:7,start:'14:30',end:'15:20',label:'Period 7'},
 {id:8,start:'15:20',end:'16:10',label:'Period 8'},
 {id:9,start:'16:10',end:'17:00',label:'Period 9'}
];
const BREAKS=[
 {type:'tea',start:'10:45',end:'11:15',label:'Tea Break'},
 {type:'lunch',start:'13:45',end:'14:30',label:'Lunch Break'}
];
const ASSESSMENTS=[
 {id:'ia1',short:'IA-1',name:'Internal Assessment 1',type:'Internal Assessment',date:null,status:'date-pending'},
 {id:'ia2',short:'IA-2',name:'Internal Assessment 2',type:'Internal Assessment',date:null,status:'date-pending'},
 {id:'see',short:'SEE',name:'Semester End Examination',type:'SEE',date:null,status:'date-pending'}
];

// Utility for UI components that want a consistent assessment summary.
function getAssessmentSummary(){
 return ASSESSMENTS.map(x=>({...x,displayDate:x.date||'Official date not published'}));
}
