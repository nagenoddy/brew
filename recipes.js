const icons={
  v60:"icons/v60.png",
  clever:"icons/clever-dripper.png",
  chemex:"icons/chemex.png",
  aeropress:"icons/aeropress.png",
  moka:"icons/moka-pot.png",
  flair:"icons/flair-neo-flex.png",
  sage:"icons/sage-precision-brewer.png",
  oxo:"icons/oxo-rapid-brewer.png"
};

const methods={
  v60:{
    icon:'v60',name:'V60',hint:'Clean pour-over. Best default for 250–450 g.',
    defaultAmount:340,presets:[250,340,450],ratio:16.5,grind:5.5,type:'Medium fine',roastAdjust:true,
    steps:['Bloom with 3× coffee weight for 45 sec.','Pour steadily to 60% of total water.','Finish pour to target weight.','Aim for 2:45–3:30 drawdown.']
  },
  aeropress:{
    icon:'aeropress',name:'AeroPress',hint:'Flexible immersion. Best in the 200–300 g range.',
    defaultAmount:250,presets:[200,250,300],ratio:14,grind:5.0,type:'Medium fine',roastAdjust:true,
    steps:['Add coffee and water.','Stir or swirl gently.','Steep 1:30–2:00.','Press slowly for 20–30 sec.']
  },
  clever:{
    icon:'clever',name:'Clever Dripper',hint:'Easy immersion-filter hybrid. Practical range: 250–400 g.',
    defaultAmount:320,presets:[250,320,400],ratio:16,grind:6.0,type:'Medium',roastAdjust:true,
    steps:['Add water first, then coffee.','Steep covered for 2:30–3:00.','Stir gently, place on cup.','Drawdown should take about 1 minute.']
  },
  chemex:{
    icon:'chemex',name:'Chemex',hint:'Large Chemex. Validated light-roast baseline: 650 g at Opus 6.25.',
    defaultAmount:650,presets:[500,650,800,1000],ratio:16.5,grind:6.25,type:'Medium coarse',roastAdjust:false,
    steps:['Bloom with 3× coffee weight for 45 sec.','Pour in slow pulses.','Keep bed from drying out.','Aim for 4:00–6:00 depending on batch size.']
  },
  moka:{
    icon:'moka',name:'Moka Pot',hint:'Rich stovetop coffee. Use medium-fine, not espresso-fine.',
    defaultAmount:150,presets:[100,150,200],ratio:10,grind:4.25,type:'Medium fine',roastAdjust:false,
    steps:['Fill basket level; do not tamp.','Use hot water in the base if possible.','Brew on medium-low heat.','Remove from heat as soon as it sputters.']
  },
  flair:{
    icon:'flair',name:'Flair Neo Flex',hint:'Bottomless portafilter baseline. Start at Opus 2.00 and make tiny changes.',
    defaultAmount:28,presets:[24,26,28,30,32],ratio:2.2,grind:2.0,type:'Espresso',roastAdjust:false,
    steps:['Dose and distribute evenly.','Tamp level and preheat brew chamber.','Pull around 30–45 seconds.','Too fast: finer. Too slow or choking: coarser.']
  },
  sage:{
    icon:'sage',name:'Sage Precision Brewer',hint:'Choose cone, flat bottom, or cold brew mode.',
    variantLabel:'Filter / process',
    defaultVariant:'cone',
    variants:{
      cone:{label:'Cone insert',defaultAmount:500,presets:[350,500,750],ratio:16.7,grind:6.75,type:'Medium',roastAdjust:true,steps:['Use the cone basket insert.','Rinse filter and add grounds.','Use Gold/Auto mode as default.','For 350 ml use slightly finer; for 750 ml use slightly coarser.']},
      flat:{label:'Flat bottom',defaultAmount:1000,presets:[750,1000,1250],ratio:16.7,grind:7.0,type:'Medium',roastAdjust:true,steps:['Use the flat bottom basket.','Rinse filter and add grounds.','Best for larger, even batch brews.','If it tastes hollow, try one quarter finer next time.']},
      cold:{label:'Cold brew',defaultAmount:750,presets:[500,750,1000],ratio:8,grind:9.0,type:'Coarse',roastAdjust:false,steps:['Use the cold brew setting.','Use coarse grind and cool water.','Stir grounds to wet evenly.','Dilute concentrate to taste if needed.']}
    }
  },
  oxo:{
    icon:'oxo',name:'OXO Rapid Brewer',hint:'Choose rapid, soup-style immersion, or small-batch cold brew.',
    variantLabel:'Recipe style',
    defaultVariant:'rapid',
    variants:{
      rapid:{label:'Rapid brew',defaultAmount:200,presets:[160,200,240],ratio:8,grind:9.5,type:'Coarse',roastAdjust:false,steps:['Use coarse grind.','Wet grounds evenly.','Press / brew per OXO Rapid Brewer instructions.','Dilute concentrate to taste if needed.']},
      soup:{label:'Soup method',defaultAmount:250,presets:[200,250,300],ratio:16.5,grind:6.0,type:'Medium',roastAdjust:true,steps:['Use medium grind.','Add all water and coffee together.','Let it steep like a full immersion brew.','Filter gently and adjust by taste next time.']},
      cold:{label:'Cold brew',defaultAmount:300,presets:[200,300,400],ratio:8,grind:9.75,type:'Coarse',roastAdjust:false,steps:['Use coarse grind.','Wet grounds evenly.','Steep cold for a longer extraction.','Dilute concentrate to taste if needed.']}
    }
  }
};
