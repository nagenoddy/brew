const icons={
  v60:"icons/v60.png",
  clever:"icons/clever-dripper.png",
  chemex:"icons/chemex.png",
  aeropress:"icons/aeropress.png",
  moka:"icons/moka-pot.png",
  flair:"icons/flair-neo-flex.png",
  sage:"icons/sage-precision-brewer.png",
  oxo:"icons/oxo-rapid-brewer.png",
  hoop:"icons/ceado-hoop.png",
  zero:"icons/trinity-zeropress.png"
};

const methods={
  v60:{
    icon:'v60',name:'V60',hint:'Clean pour-over. Best default for 250–450 g.',
    defaultAmount:340,presets:[250,340,450],ratio:16.5,grind:5.5,type:'Medium fine',roastAdjust:true,
    steps:['Rinse the paper filter well; discard the rinse water.','Bloom with 2–3× coffee weight, gentle swirl, 45 sec.','Pour to 60% of total in slow centre-out circles by 1:15.','Final pour to weight by 1:45, then one gentle swirl to settle the bed.','Drawdown done by 2:30–3:15 — the bed should finish flat, not domed.'],
    techniques:{
      classic:{label:'Classic'},
      hoffmann:{label:'Hoffmann-style',ratio:16.7,steps:['Rinse well; add grounds and dig a small well in the centre.','Bloom with 2\u00d7 coffee weight at 0:00; swirl, rest to 0:45.','Pour steadily to 60% of total by 1:15, keeping it central.','Pour to full weight by 1:45; one stir each way with a spoon, then a final gentle swirl.','Let it draw down flat \u2014 around 3:30 total is on target.']},
      threefe:{label:'3fe',steps:['Rinse well; papers fully wet and stuck, no creases. Level the bed.','Pour 50g over 10 sec to wet everything; bloom to 0:30.','At 0:30, pour 50g in slow circles, inside out, over 10\u201315 sec.','Keep pouring 50g every 30 sec until you hit target weight.','Let it drip out fully \u2014 3:00\u20134:00 total is the window.']},
      kasuya:{label:'Kasuya 4:6',ratio:15,grind:6.5,steps:['Grind coarse \u2014 this method leans on time, not fineness.','Split water 40/60. First 40% in two pours, 45 sec apart.','Even split = balanced. Bigger first pour = brighter; smaller = sweeter.','Remaining 60% in 1\u20133 pours, 45 sec apart \u2014 more pours, more strength.','Each pour should drain before the next; done around 3:30.']},
      hedrick:{label:'Hedrick-style',ratio:15,steps:['Rinse, add coffee, level the bed.','Bloom with 3\u00d7 coffee weight; swirl gently; rest to 0:30.','Pour in thirds: to 1/3 of total by 1:00, 2/3 by 1:30, full by 2:00.','Slow steady circles each time; drawdown done near 3:00.','Runs on any dripper \u2014 hotter water for light roasts, cooler for dark.']}
    }
  },
  aeropress:{
    icon:'aeropress',name:'AeroPress',hint:'Flexible immersion. Best in the 200–300 g range.',
    defaultAmount:250,presets:[200,250,300],ratio:14,grind:5.0,type:'Medium fine',roastAdjust:true,
    steps:['Rinse the filter, lock the cap on, set over a sturdy cup.','Add coffee, then all the water within about 10 sec.','Stir three times; steep 1:30–2:00.','Press gently over 25–30 sec and stop at the hiss.','Sharp or sour: finer or steep longer. Harsh: coarser.'],
    techniques:{
      classic:{label:'Classic'},
      inverted:{label:'Inverted',steps:['Assemble upside-down with the plunger just inside; add coffee.','Add all the water; stir gently; steep 1:30\u20132:00.','Rinse the filter, cap on, cup on top \u2014 and flip with confidence.','Press gently over 25\u201330 sec, stopping at the hiss.','Sharp or sour: finer or longer. Harsh: coarser.']},
      hoffmann:{label:'Hoffmann-style',ratio:18.2,grind:4.75,steps:['No rinse needed \u2014 cap the dry filter, brewer on the cup.','Add coffee, then all the water. No stir, no bloom.','Steep 2:00 undisturbed; swirl gently, then wait 30 sec more.','Press slowly all the way \u2014 take your time.','Long steep, finer grind, gentler ratio: expect a clean, light-bodied cup.']},
      threefe:{label:'3fe',ratio:15.3,grind:4.75,steps:['Invert with the plunger at the bottom; preheat and rinse.','Two rinsed papers in the cap \u2014 cleaner, brighter cup.','Add coffee, fill near the brim, gently break the crust.','Cap on, flip onto the cup in one smooth motion.','At 1:30, press firm but slow \u2014 about 30 sec.']}
    }
  },
  clever:{
    icon:'clever',name:'Clever Dripper',hint:'Easy immersion-filter hybrid. Practical range: 250–400 g.',
    defaultAmount:320,presets:[250,320,400],ratio:16,grind:6.0,type:'Medium',roastAdjust:true,
    steps:['Rinse the filter with the valve closed; discard rinse water.','Water first, then coffee — it wets the grounds evenly with no dry pockets.','Lid on; steep 2:30–3:00, then a gentle stir to break the crust.','Set on the server to release — drawdown around 1:00–1:30.','Slow drawdown or muddy cup: go coarser next time.'],
    techniques:{
      classic:{label:'Classic'},
      hybrid:{label:'Hybrid',steps:['Rinse the filter; coffee in first this time.','Off the server (valve closed): pour 60% of the water, stir once, steep to 1:30.','Place on the server \u2014 the valve opens and it starts to drain.','As it drains, pour the last 40% through like a pour-over.','Immersion sweetness up front, percolation clarity to finish.']}
    }
  },
  chemex:{
    icon:'chemex',name:'Chemex',hint:'Large Chemex. Validated light-roast baseline: 650 g at Opus 6.25.',
    defaultAmount:650,presets:[500,650,800,1000],ratio:16.5,grind:6.25,type:'Medium coarse',roastAdjust:false,
    steps:['Seat the filter with the triple-fold side over the spout; rinse thoroughly — Chemex paper is thick.','Bloom 45–60 sec; the heavy paper rewards a longer wet.','Pour in 3–4 pulses, keeping the slurry a few cm below the rim.','Large batches run long — 4:00–6:00 is normal, don\'t chase speed.','Remove the filter when dripping slows, swirl the carafe, serve.']
  },
  moka:{
    icon:'moka',name:'Moka Pot',hint:'Rich stovetop coffee. Use medium-fine, not espresso-fine.',
    defaultAmount:150,presets:[100,150,200],ratio:10,grind:4.25,type:'Medium fine',roastAdjust:false,
    steps:['Fill the base with hot water to just below the valve.','Fill the basket level and brush off — never tamp a moka.','Medium-low heat, lid open so you can watch the flow.','Kill the heat the moment the stream turns pale and starts to sputter.','Run the base under a cold tap to stop extraction dead.']
  },
  flair:{
    icon:'flair',name:'Flair Neo Flex',hint:'Bottomless portafilter baseline. Start at Opus 2.00 and make tiny changes.',
    defaultAmount:28,presets:[24,26,28,30,32],ratio:2.2,grind:2.0,type:'Espresso',roastAdjust:false,
    steps:['Preheat: boiling water through the brew head and portafilter, then dry.','Grind fine; distribute evenly (stir out clumps) and tamp level and firm.','Pull with slow, even lever pressure — smooth beats strong.','Target roughly 2× the coffee weight out, 30–45 sec from first drips.','Spritzing from the bottomless PF is puck prep, not grind. Gushing: finer. Choking: coarser.']
  },
  sage:{
    icon:'sage',name:'Sage Precision Brewer',hint:'Choose cone, flat bottom, or cold brew mode.',
    variantLabel:'Filter / process',
    defaultVariant:'cone',
    variants:{
      cone:{label:'Cone insert',defaultAmount:500,presets:[350,500,750],ratio:16.7,grind:6.5,grindCurve:[[350,6.25],[500,6.5],[750,6.75]],type:'Medium',roastAdjust:true,steps:['Fit the cone insert with a rinsed paper filter.','Level the grounds; Gold Cup mode as the default.','The dial\'s grind already accounts for your batch size.','Thin or hollow at small batches: one quarter finer next brew.']},
      flat:{label:'Flat bottom',defaultAmount:1000,presets:[750,1000,1250],ratio:16.7,grind:7.0,grindCurve:[[750,6.75],[1000,7.0],[1250,7.25]],type:'Medium',roastAdjust:true,steps:['Flat basket with the metal filter — expect more body and oils than paper.','Level the bed; Gold Cup mode as the default.','The dial\'s grind already accounts for your batch size.','Silty or heavy cups: one quarter coarser, or switch to paper for clarity.']},
      cold:{label:'Cold brew',defaultAmount:750,presets:[500,750,1000],ratio:8,grind:9.0,type:'Coarse',roastAdjust:false,steps:['Cold Brew setting; coarse grind, cool water.','Stir once so no grounds sit dry.','Let the full cycle run, then refrigerate.','Serve over ice; dilute the concentrate to taste.']}
    }
  },
  oxo:{
    icon:'oxo',name:'OXO Rapid Brewer',hint:'Choose rapid, soup-style immersion, or small-batch cold brew.',
    variantLabel:'Recipe style',
    defaultVariant:'rapid',
    variants:{
      rapid:{label:'Rapid brew',defaultAmount:200,presets:[160,200,240],ratio:8,grind:9.5,type:'Coarse',roastAdjust:false,steps:['Coarse grind into the chamber; add water to the fill line.','Swirl so everything is wet — no dry clumps.','Press slowly and steadily to drive the brew through.','It makes concentrate — pour over ice or dilute to taste.']},
      soup:{label:'Soup method',defaultAmount:250,presets:[200,250,300],ratio:16.5,grind:6.0,type:'Medium',roastAdjust:true,steps:['Medium grind; add all the coffee and water together.','Stir once, then leave it — full immersion does the work.','Steep long and patient; taste to decide when it\'s done.','Filter gently; adjust steep time before touching the grind.']},
      cold:{label:'Cold brew',defaultAmount:300,presets:[200,300,400],ratio:8,grind:9.75,type:'Coarse',roastAdjust:false,steps:['Coarse grind; wet the grounds evenly with cool water.','Steep cold and long — hours, not minutes.','Draw down and refrigerate the concentrate.','Dilute to taste; cold brew hides sour, so err coarser.']}
    }
  },
  hoop:{
    icon:'hoop',name:'Ceado Hoop',hint:'Flat-bed pour-over. Even, forgiving extraction \u2014 suits fruity filter roasts.',
    defaultAmount:350,presets:[250,350,500],ratio:16.5,grind:6.0,type:'Medium',roastAdjust:true,
    steps:['Rinse the basket filter and level it in the brewer.','Bloom with 3× coffee weight for 40 sec.','Pour in 2–3 slow, even spirals — keep the bed level throughout.','A flat bed at the end is the tell; about 3:00–3:45 total.','Uneven bed at the finish: slow the pour, not the grind.'],
    techniques:{
      classic:{label:'Classic'},
      hedrick:{label:'Hedrick-style',ratio:15,steps:['Rinse the basket filter; level the bed.','Bloom with 3\u00d7 coffee weight; swirl; rest to 0:30.','Pour in thirds: 1/3 by 1:00, 2/3 by 1:30, full by 2:00.','Slow even circles \u2014 the flat bed loves this cadence.','Drawdown near 3:00; flat bed at the finish.']}
    }
  },
  zero:{
    icon:'zero',name:'Trinity ZeroPress',hint:'Compact press immersion. Small, punchy cups \u2014 great starting point below.',
    defaultAmount:150,presets:[120,150,200],ratio:14,grind:5.0,type:'Medium fine',roastAdjust:true,
    steps:['Preheat the chamber with a splash of hot water; discard.','Add coffee, then water just off the boil; one gentle stir.','Steep 2:00–2:30 with the cap resting on.','Press slow and steady with both palms — about 30 sec.','Muddy cup: coarser. Weak: finer or steep longer.']
  }
};
