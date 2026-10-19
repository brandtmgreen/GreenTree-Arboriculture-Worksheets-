/**
 * Weekly Safety Meeting Presenter Playbook & Scripts
 * 
 * Curated for Crew Leaders, Safety Officers, and Field Foremen.
 * Each script is designed for a 3-5 minute morning tailboard talk with:
 * 1. Call to Attention (hooks the crew and establishes quiet authority)
 * 2. Story of a Real Event (concrete narrative showing real consequences)
 * 3. The Safety Rule (the exact ANSI Z133 / OSHA practice that prevents it)
 * 4. The Joke (arborist humor to break tension and solidify memory)
 * 5. Hands-In Huddle (unifying team chant to break for work)
 */

export interface SafetyScript {
  id: string;
  topicNumber: number;
  title: string;
  category: 'Machinery & Tools' | 'Electrical Hazards' | 'Climbing & Rigging' | 'Felling & Drop Zones' | 'Health & Environmental';
  ansiReference: string;
  durationMinutes: number;
  callToAttention: {
    script: string;
    stageDirection: string;
  };
  realEventStory: {
    headline: string;
    narrative: string;
    consequence: string;
    stageDirection: string;
  };
  theSafetyRule: {
    ruleTitle: string;
    ruleText: string;
    practicalDemonstration: string;
    stageDirection: string;
  };
  theJoke: {
    setup: string;
    punchline: string;
    stageDirection: string;
  };
  handsInHuddle: {
    call: string;
    response: string;
    stageDirection: string;
  };
  presenterTips: string[];
}

export interface SpeakerAdviceSection {
  title: string;
  subtitle: string;
  iconName: string;
  tactics: {
    heading: string;
    explanation: string;
    actionableDrill: string;
  }[];
}

export const NERVOUS_SPEAKER_COACH: SpeakerAdviceSection[] = [
  {
    title: 'Pre-Meeting Physiology & Calmness',
    subtitle: 'Taming the adrenaline spike before stepping into the circle',
    iconName: 'HeartPulse',
    tactics: [
      {
        heading: 'The 4-4-4-4 Box Breathing Reset',
        explanation: 'When adrenaline hits, your heart rate climbs and vocal cords tighten, causing your voice to crack or rush. Deep belly breathing activates the vagus nerve and drops your heart rate within 30 seconds.',
        actionableDrill: '2 minutes before calling the crew: Inhale through your nose for 4 counts, hold for 4, exhale slowly through your mouth for 4, and hold empty for 4. Repeat 3 times.'
      },
      {
        heading: 'The Clipboard Anchor Technique',
        explanation: 'Trembling fingers and awkward pockets happen when nervous energy has nowhere to go. Holding a solid clipboard gives your upper body an anchor and eliminates fidgeting.',
        actionableDrill: 'Rest the bottom of your clipboard gently against your belt with your non-dominant hand. Keep your other hand free to point and gesture.'
      },
      {
        heading: 'The "One Crew Member" Focus Shift',
        explanation: 'Public speaking feels terrifying when you feel judged by a crowd. But a tailboard is not an audience—it is five or six friends you have dinner or coffee with every week.',
        actionableDrill: 'Pick one trusted crew member who gives supportive eye contact. Start by speaking your first sentence directly to them, then widen your circle.'
      }
    ]
  },
  {
    title: 'Vocal Delivery & Circle Presence',
    subtitle: 'Commanding attention over shop fans and idling diesel trucks',
    iconName: 'Volume2',
    tactics: [
      {
        heading: 'Slow Down by 20% & Own the Pause',
        explanation: 'Nervous speakers rush through their points like a runaway chainsaw to get it over with. Speed breeds "ums", "uhs", and loss of authority. Deliberate pauses command the circle.',
        actionableDrill: 'After you ask a question or drop a serious stat, pause for two full seconds before continuing. It feels like an eternity to you, but sounds completely authoritative to the crew.'
      },
      {
        heading: 'The 3-Point Triangle Gaze',
        explanation: 'Do not stare at the script or stare down at your boots. Scanning the circle keeps every person accountable and listening.',
        actionableDrill: 'Look at the person on the far left for one thought, the person in the dead center for the next thought, and the person on the far right for the third. Keep your chin parallel to the ground.'
      },
      {
        heading: 'Diaphragm Projection Over Shop Noise',
        explanation: 'If the wood chipper is warming up or traffic is humming, yelling from your throat strains your vocal cords. Speak from your belly.',
        actionableDrill: 'Take a breath into your lower abdomen. Speak as if you are trying to reach the person standing slightly behind the back row.'
      }
    ]
  },
  {
    title: 'Delivering the Joke & Landing the Huddle',
    subtitle: 'Pacing the humor and finishing with genuine team energy',
    iconName: 'Smile',
    tactics: [
      {
        heading: 'Do Not Laugh Before the Punchline',
        explanation: 'The number one mistake with jokes is smiling too early or giggling during the setup. Deadpan delivery makes arborist humor ten times funnier.',
        actionableDrill: 'Deliver the setup completely straight-faced. Pause 1 second before the punchline. Deliver the punchline clearly, then let the crew react before joining in.'
      },
      {
        heading: 'The Authenticity Rule',
        explanation: 'You do not need to be a comedian or a corporate motivational speaker. Your crew respects honesty, competence, and the fact that you want everyone to make it home in one piece.',
        actionableDrill: 'If you fumble a word, smile, say "You know what I mean," and keep moving. Nobody cares about a stumble—they care about the message.'
      },
      {
        heading: 'Initiating the Hands-In Huddle Without Hesitation',
        explanation: 'If you hesitate or say "Uh, do we want to huddle?", it feels forced. Step in with your hand out and call it with total certainty.',
        actionableDrill: 'Immediately after the laugh, step one foot forward, thrust your hand into the center of the circle, and bark: "Bring it in! Hands in right now!" The crew will follow your physical lead.'
      }
    ]
  }
];

export const SAFETY_SCRIPTS: SafetyScript[] = [
  // SCRIPT 1: CHIPPER WINCH & IN-FEED
  {
    id: 'script-chipper-winch',
    topicNumber: 1,
    title: 'The Chipper Winch Line & In-Feed Trap',
    category: 'Machinery & Tools',
    ansiReference: 'ANSI Z133 Section 5.3 (Brush Chippers)',
    durationMinutes: 4,
    callToAttention: {
      script: 'Alright crew, kill the leaf blowers and bring it in tight for three minutes! Eyes up here—nobody touches an ignition key until we lock this in.',
      stageDirection: 'Step into the center of the tailgate circle. Make direct eye contact with the equipment operators first.'
    },
    realEventStory: {
      headline: 'The 3-Second Winch Line Wrap',
      narrative: 'Two years ago, a veteran tree crew in Pennsylvania was feeding a 12-inch hickory log into an 18-inch drum chipper. They had rigged a heavy stem with the hydraulic winch line. After unhooking the choke, the ground tech thought the cable was clear and hit the reverse feed lever. But the loose winch hook caught on a side limb that was already entering the feed rollers. In less than 3 seconds, that 3/8-inch steel winch cable was snatched into the drum, violently whipping the operator into the feed chute.',
      consequence: 'He survived only because his coworker threw his entire body across the emergency stop bar. Even so, he spent six months in reconstructive surgery with a fractured pelvis and torn rotator cuff.',
      stageDirection: 'Lower your voice tone slightly to emphasize the suddenness. Count to three on your fingers.'
    },
    theSafetyRule: {
      ruleTitle: 'The 10-Foot Winch Disconnect & Panic Bar Rule',
      ruleText: 'Never activate in-feed rollers while a winch line is within 10 feet of the hopper table. Winch lines must be retracted, spooled, and locked down BEFORE the feed wheels engage. Always test the emergency panic bar at morning startup.',
      practicalDemonstration: 'Stand sideways to the hopper when feeding brush—never feed from the center line. If you slip, your hip hits the stop bar, not your head.',
      stageDirection: 'Physically mimic feeding from the side with hands at chest height, then mimic bumping a stop bar with your hip.'
    },
    theJoke: {
      setup: 'Look, they say wood chippers have no feelings, but that\'s not true...',
      punchline: 'Every wood chipper has a favorite food—and it\'s anything that costs more than two weeks of your paycheck.',
      stageDirection: 'Wait for the chuckle, smile, and immediately lean forward for the close.'
    },
    handsInHuddle: {
      call: 'Watch each other\'s blind spots today! Hands in—SAFETY on three, HOME SAFE on six!',
      response: '1, 2, 3: SAFETY! 4, 5, 6: HOME SAFE!',
      stageDirection: 'Thrust hand into center of circle, wait for all hands to stack, count off with high energy.'
    },
    presenterTips: [
      'Show the chipper stop bar physically before or right after the meeting.',
      'Emphasize that feeding from the side is muscle memory, not just a suggestion.'
    ]
  },

  // SCRIPT 2: ELECTRICAL MINIMUM APPROACH DISTANCE
  {
    id: 'script-electrical-mad',
    topicNumber: 2,
    title: 'The Invisible Arc: 10-Foot MAD Rule',
    category: 'Electrical Hazards',
    ansiReference: 'ANSI Z133 Table 1 & OSHA 1910.269',
    durationMinutes: 4,
    callToAttention: {
      script: 'Bring it in, y\'all! Close the circle up. Let\'s have two minutes of clean ears before we pull harnesses out of the boxes.',
      stageDirection: 'Clap hands twice firmly to cut through background truck chatter.'
    },
    realEventStory: {
      headline: 'The Morning Dew Phase-to-Ground Arc',
      narrative: 'A crew in Virginia was doing standard clearance pruning along a residential driveway. There was a 13.2 kV distribution conductor running 8 feet above the upper oak canopy. The morning was damp with heavy fog. The climber was experienced—over ten years in the saddle. He wasn\'t touching the line; he thought he had 18 inches of clearance with his fiberglass pole saw. But moisture on the pole combined with airborne carbon soot created a conductive path. The current didn\'t wait for him to touch the wire—it arced 14 inches through the damp air right into the ferrule.',
      consequence: 'He sustained third-degree burns across both hands and exited consciousness instantly. His aerial rescue team got him down in 4 minutes, but his career as a climber was finished that morning.',
      stageDirection: 'Pause for two seconds after "finished that morning" to let the gravity sink in.'
    },
    theSafetyRule: {
      ruleTitle: 'Treat Every Wire as 50,000 Volts Until Verified',
      ruleText: 'Non-line-clearance arborists must stay at least 10 FEET away from any conductor up to 50 kV at all times. Qualified line clearance arborists must verify Table 1 clearances. Electricity does NOT require direct physical contact to kill you.',
      practicalDemonstration: 'When looking up, visualize a 10-foot sphere around every phase line. If a branch dips into that sphere when you make a cut, STOP and notify the utility.',
      stageDirection: 'Extend both arms wide to demonstrate what a 10-foot radius actually looks like in real space.'
    },
    theJoke: {
      setup: 'Remember guys: Electricity travels at the speed of light, which is roughly 186,000 miles per second...',
      punchline: 'Which means you will never, ever beat it in a footrace, even if you laced your boots tight this morning.',
      stageDirection: 'Deadpan delivery on the punchline, then grin.'
    },
    handsInHuddle: {
      call: 'Eyes in the canopy, stay clear of the wires! Hands in!',
      response: '1, 2, 3: CLEAR! 4, 5, 6: ZERO CONTACT!',
      stageDirection: 'Center your hand, nod at your lead climber, and break with a solid cheer.'
    },
    presenterTips: [
      'Remind ground workers that conductive tools on the ground (aluminum ladders, pole saws) are just as dangerous.',
      'Point toward an overhead wire nearby in the yard as a real visual reference.'
    ]
  },

  // SCRIPT 3: BARBER-CHAIR & TENSION WOOD
  {
    id: 'script-barber-chair',
    topicNumber: 3,
    title: 'The Barber-Chair Trunk Explosion',
    category: 'Felling & Drop Zones',
    ansiReference: 'ANSI Z133 Section 8.5 (Felling Procedures)',
    durationMinutes: 4,
    callToAttention: {
      script: 'Tailboard time, team! Gather around the back of Truck 1. Saws off, ears on. Let\'s talk wood physics.',
      stageDirection: 'Lean against the tailgate holding the felling wedge in your hand.'
    },
    realEventStory: {
      headline: 'The Heavy Forward Leaner on a Windy Afternoon',
      narrative: 'A heavy 34-inch Red Oak had a severe 20-degree forward lean toward a customer\'s septic field. The sawyer decided to put in a shallow conventional notch and start his backcut from the rear. What he didn\'t account for was the immense tension running up the back fibers of that trunk. Before his guide bar was even halfway through, the wood fibers tore vertically upward at supersonic speed. The trunk split from the stump straight up 12 feet like an exploding catapult—the classic barber-chair.',
      consequence: 'The rear half of the tree shot backward like a battering ram, pinning the sawyer\'s legs and crushing his chest against a boulder before he could take a single step along his escape route.',
      stageDirection: 'Use your hands to mimic the trunk splitting vertically upward and shooting backward.'
    },
    theSafetyRule: {
      ruleTitle: 'Bore-Cutting & 10% Hinge Wood Preservation',
      ruleText: 'On heavy forward leaners, NEVER cut straight in from the back. Use an open-face 70-to-90-degree notch, bore into the heartwood behind the hinge to establish your 10% hinge first, and release the tree from the back strap with a downward angled cut.',
      practicalDemonstration: 'Establish your escape route at 45 degrees back and to the side BEFORE you touch the throttle. Not during the cut—BEFORE.',
      stageDirection: 'Point 45 degrees backward with your boot to visually reinforce the escape angle.'
    },
    theJoke: {
      setup: 'Why do they call it a barber-chair anyway?',
      punchline: 'Because if you don\'t bore-cut that forward leaner, it\'ll give you the closest shave you\'ll never remember.',
      stageDirection: 'Smile and tap your temple.'
    },
    handsInHuddle: {
      call: 'Bore the heart, save the hinge! Hands in!',
      response: '1, 2, 3: BORE CUT! 4, 5, 6: STAND CLEAR!',
      stageDirection: 'Bring the crew in tight for the hands-stacked huddle.'
    },
    presenterTips: [
      'Hold up a felling wedge or draw the bore cut on a scrap piece of wood if someone looks confused.',
      'Ask your newest crew member what a 45-degree escape path looks like.'
    ]
  },

  // SCRIPT 4: DROP ZONE & BLIND RAKING
  {
    id: 'script-drop-zone-raking',
    topicNumber: 4,
    title: 'The Silent Drop Zone: No Blind Raking',
    category: 'Felling & Drop Zones',
    ansiReference: 'ANSI Z133 Section 3.4 (Communications & Drop Zones)',
    durationMinutes: 3,
    callToAttention: {
      script: 'Circle up, everybody! Steve, grab the new guy and bring him over. Two minutes on drop zone protocol before we roll out.',
      stageDirection: 'Wave in any ground workers who are still checking fluid levels.'
    },
    realEventStory: {
      headline: 'The Rake in the Drop Zone',
      narrative: 'Last summer in Ohio, a climber was taking down dead ash wood 50 feet up in a tight backyard. On the ground, an eager first-month ground tech wanted to keep the lawn pristine. Without shouting up or making eye contact, he stepped right under the climber\'s canopy with a steel landscape rake to gather small twigs. The climber had just severed a 4-inch stub that was hung up in a crotch. The stub slid free silently without a chainsaw revving.',
      consequence: 'That 4-inch stub hit the ground tech directly on the shoulder and collarbone. It fractured his clavicle and knocked him unconscious. A hard hat saves your skull, but 30 pounds dropping from 50 feet will shatter bones anywhere else.',
      stageDirection: 'Drop a small piece of wood or your pen onto the tailgate with a sharp slap.'
    },
    theSafetyRule: {
      ruleTitle: 'Command-and-Response Voice Protocol',
      ruleText: 'The drop zone is an active hot zone until the climber gives the ALL CLEAR signal. No ground worker enters the drop zone without verbal command-and-response ("STAND CLEAR!" answered by "CLEAR!"). If the climber hasn\'t made eye contact, you stay out.',
      practicalDemonstration: 'Never look up while walking into the drop zone. Stop outside the zone, look up from safety, shout, and wait for confirmation.',
      stageDirection: 'Look up, cup your hand to your mouth, and demonstrate: "HEADS UP!" and "ALL CLEAR!"'
    },
    theJoke: {
      setup: 'I know the homeowners love a tidy lawn, but remember...',
      punchline: 'Rakes are easily replaceable at Home Depot for thirty bucks. Your collarbone isn\'t on sale this week.',
      stageDirection: 'Give a quick grin and point to your own shoulder.'
    },
    handsInHuddle: {
      call: 'Eyes up, ears open, stay out of the drop! Hands in!',
      response: '1, 2, 3: EYES UP! 4, 5, 6: ALL CLEAR!',
      stageDirection: 'Throw your hand into the stack and lead the chant.'
    },
    presenterTips: [
      'Remind climbers that they are just as responsible for calling out before cuts as ground workers are for staying back.',
      'Check that everyone has their chinstraps buckled.'
    ]
  },

  // SCRIPT 5: CHAINSAW KICKBACK & THE REACTIVE ZONE
  {
    id: 'script-chainsaw-kickback',
    topicNumber: 5,
    title: 'The Upper Tip Reactive Kickback Zone',
    category: 'Machinery & Tools',
    ansiReference: 'ANSI Z133 Section 5.1 (Chain Saws)',
    durationMinutes: 4,
    callToAttention: {
      script: 'Alright team, gather \'round! Let\'s get tight. Today\'s safety briefing is about the sharpest thing on the job truck.',
      stageDirection: 'Rest one hand on an unpowered chainsaw bar guard on the truck bed.'
    },
    realEventStory: {
      headline: 'The Blind Tip Contact in the Brush Pile',
      narrative: 'A ground tech was bucking limbs in a crowded brush pile after a major storm clean-up. He was cutting through a 6-inch maple branch with the lower quarter of the bar. What he didn\'t see was a hidden 2-inch seasoned oak branch right behind it, touching the upper quadrant of the guide bar tip—the reactive kickback zone. In 0.08 seconds, the chain caught. The saw kicked violently upward and back toward his face at 60 miles an hour.',
      consequence: 'His chain brake tripped on his front wrist, stopping the teeth literally one inch from his safety glasses. He walked away with a bruised wrist and ruined underwear instead of a ruined face.',
      stageDirection: 'Snap your fingers quickly to demonstrate how fast 0.08 seconds is.'
    },
    theSafetyRule: {
      ruleTitle: 'Thumb-Wrap Grip & Daily Chain Brake Verification',
      ruleText: 'Always wrap your left thumb COMPLETELY around the front handlebar—never use an open monkey-paw grip. Ensure your body is offset to the left of the cutting plane, and test your inertia chain brake before every shift.',
      practicalDemonstration: 'Show the crew the upper quadrant of the bar tip: "This is the no-fly zone. Know where your tip is before you pull the throttle."',
      stageDirection: 'Point to the top quarter of the bar tip on the saw, then wrap your thumb firmly around the handle.'
    },
    theJoke: {
      setup: 'They say money talks, but a chainsaw doesn\'t even have to talk...',
      punchline: 'It just bites whatever you don\'t pay attention to. And it doesn\'t know the difference between white oak and denim pants.',
      stageDirection: 'Smile and pat your chainsaw chaps.'
    },
    handsInHuddle: {
      call: 'Wrap that thumb, check your brake! Hands in!',
      response: '1, 2, 3: WRAP IT! 4, 5, 6: HOME SAFE!',
      stageDirection: 'Stack hands quickly and break with enthusiasm.'
    },
    presenterTips: [
      'Have one crew member demonstrate the thumb-wrap grip right in the circle.',
      'Check that chaps are snug and buckled properly.'
    ]
  },

  // SCRIPT 6: HEAT STRESS & HYDRATION
  {
    id: 'script-heat-stress',
    topicNumber: 6,
    title: 'Heat Exhaustion & Heavy PPE in July',
    category: 'Health & Environmental',
    ansiReference: 'OSHA Heat Illness Prevention & ANSI Z133 3.3',
    durationMinutes: 3,
    callToAttention: {
      script: 'Bring it in, crew! It\'s going to hit 92 degrees by lunch, and that means we need our heads screwed on straight. Two minutes, listen up.',
      stageDirection: 'Hand a bottle of water to someone as you start speaking.'
    },
    realEventStory: {
      headline: 'The Climber Who Forgot His Brain Runs on Water',
      narrative: 'Three summers ago on a brutal 95-degree afternoon with 80% humidity, our top climber was finishing up his fourth deadwood removal of the day. He had skipped breakfast, drank two energy drinks on the drive in, and had only sipped half a bottle of water. At 45 feet in the air, inside full heavy chainsaw pants, climbing saddle, and hard hat, his core temperature spiked past 102 degrees. He stopped responding on the two-way radio. When his ground tech looked up, he had his carabiner unclipped and was trying to step onto a dead 2-inch branch that couldn\'t hold a squirrel.',
      consequence: 'He was delirious from heat exhaustion. The crew had to execute a full aerial rescue to get him down before he passed out and fell out of the canopy.',
      stageDirection: 'Shake your head slowly to emphasize the delirium and danger of mental confusion.'
    },
    theSafetyRule: {
      ruleTitle: 'The 1-Quart Per Hour Rule & Electrolyte Balance',
      ruleText: 'In temperatures above 85°F, drink at least one quart (32 oz) of water or electrolyte mix every hour—not energy drinks. Energy drinks dehydrate your kidneys and spike your heart rate. Watch your partner for slurred speech, clumsy footwork, or lack of sweat.',
      practicalDemonstration: 'Take forced shade breaks between canopy ascends. If your partner stops sweating, stop work immediately and get cold packs on their neck and groin.',
      stageDirection: 'Tap the side of your neck where the carotid artery runs to show where cooling packs go.'
    },
    theJoke: {
      setup: 'Monster Energy might give you wings in the parking lot...',
      punchline: 'But at ninety-five degrees up in a pin oak, what you really need is cold water and a brain that works.',
      stageDirection: 'Hold up a water jug and smile.'
    },
    handsInHuddle: {
      call: 'Drink your water, watch your brothers! Hands in!',
      response: '1, 2, 3: HYDRATE! 4, 5, 6: FINISH STRONG!',
      stageDirection: 'Put your hand in with genuine warmth and lead the call.'
    },
    presenterTips: [
      'Check that the truck cooler has fresh ice and water bottles before leaving the yard.',
      'Remind workers that taking a 5-minute shade break is professional, not weak.'
    ]
  },

  // SCRIPT 7: RIGGING SHOCK LOADS
  {
    id: 'script-rigging-shock-loads',
    topicNumber: 7,
    title: 'Dynamic Rigging Shock Loads & Crotch Multipliers',
    category: 'Climbing & Rigging',
    ansiReference: 'ANSI A300 Part 3 & ANSI Z133 Section 8.4',
    durationMinutes: 4,
    callToAttention: {
      script: 'Tailboard time! Put the rigging bags down and gather around the tailgate. Let\'s talk physics before we pull rope.',
      stageDirection: 'Hold a rigging block or heavy carabiner in your hand.'
    },
    realEventStory: {
      headline: 'The 500-Pound Log that Hit with 5,000 Pounds of Force',
      narrative: 'A crew was rigging a large codominant oak stem over a glass sunroom. The piece cut was estimated at 600 pounds. The climber ran the rigging bull rope through a high crotch, but let the piece drop 4 feet before the ground tech locked down the Port-a-Wrap. That 4-foot dynamic free-fall multiplied the static 600-pound weight into over 4,500 pounds of instantaneous shock force at the anchor point. The anchor crotch had invisible included bark and snapped like a dry pretzel.',
      consequence: 'The anchor point, rigging block, and 600-pound log all crashed through the customer\'s sunroom glass roof simultaneously. Miraculously, no one was killed, but the damage was $45,000 and the company\'s insurance rate doubled overnight.',
      stageDirection: 'Drop your hand sharply from head height to waist height to simulate a free-fall drop.'
    },
    theSafetyRule: {
      ruleTitle: 'The Pre-Tension Rule & 10:1 Rigging Safety Factor',
      ruleText: 'Always take all slack out of the rigging line BEFORE the cut is finished. Never allow dynamic free-fall on a heavy piece unless you are using negative rigging with a designated friction device. Verify your anchor crotch has sound wood and no included bark.',
      practicalDemonstration: 'The ground tech must maintain dynamic friction—let the rope slide smoothly to decelerate the load over time rather than dead-stopping it.',
      stageDirection: 'Show the rope-sliding motion with your palms facing each other.'
    },
    theJoke: {
      setup: 'Sir Isaac Newton invented gravity back in 1687...',
      punchline: 'And he has never, not once in 300 years, taken a day off on a tree job. Respect the rope!',
      stageDirection: 'Laugh and point toward the sky.'
    },
    handsInHuddle: {
      call: 'Check the anchor, take the slack! Hands in!',
      response: '1, 2, 3: RIG SAFE! 4, 5, 6: NO SHOCK LOADS!',
      stageDirection: 'Thrust hand into center and bring the crew in tight.'
    },
    presenterTips: [
      'Remind ground workers that Port-a-Wrap wraps must match the piece weight—too many wraps creates a dead stop; too few drops the piece.',
      'Check that rigging blocks have smooth sheaves with no metal burrs.'
    ]
  },

  // SCRIPT 8: TRAFFIC CONTROL & ROADWAY SAFETY
  {
    id: 'script-traffic-control',
    topicNumber: 8,
    title: 'Work Zone Traffic Control & Public Distraction',
    category: 'Felling & Drop Zones',
    ansiReference: 'MUTCD & ANSI Z133 Section 3.6',
    durationMinutes: 3,
    callToAttention: {
      script: 'Huddle up, crew! We have two roadside jobs today on busy four-lane streets. Saws down, ears forward.',
      stageDirection: 'Hold up an orange traffic cone or high-vis vest.'
    },
    realEventStory: {
      headline: 'The Driver Texting Through the Cones',
      narrative: 'A municipal tree crew had their bucket truck set up on the shoulder of a 45 mph road. They set up three cones 10 feet behind the truck and started working. An SUV driver looking down at their cell phone never even saw the cones. The SUV plowed straight through the cones at 40 miles an hour, striking the chipper tongue and spinning into the rear outrigger just as the bucket operator was swinging over the lane.',
      consequence: 'The impact jarred the boom violently, tossing the operator into his harness. If he hadn\'t been tied in with his full-body harness and lanyard, he would have been catapulted onto the asphalt.',
      stageDirection: 'Point to your harness attachment point on your chest.'
    },
    theSafetyRule: {
      ruleTitle: 'MUTCD Taper Formula & Class 3 High-Vis',
      ruleText: 'Traffic control requires proper advance warning signs and a full cone taper based on road speed (Taper Length = Speed × Lane Width). Every worker within 15 feet of traffic must wear ANSI Class 2 or Class 3 high-vis apparel.',
      practicalDemonstration: 'Do not assume drivers are watching you—assume every driver is texting. Never turn your back on moving traffic without a spotter.',
      stageDirection: 'Turn your back to the circle for one second, then spin around quickly: "Never turn your back on traffic."'
    },
    theJoke: {
      setup: 'Orange traffic cones are great, but remember...',
      punchline: 'They are made of six dollars worth of soft plastic. They are not force fields, and they won\'t stop a Ford F-150.',
      stageDirection: 'Deadpan look at the crew, then grin.'
    },
    handsInHuddle: {
      call: 'Wear the vest, watch the road! Hands in!',
      response: '1, 2, 3: HIGH-VIS! 4, 5, 6: STAY SHARP!',
      stageDirection: 'Stack hands and break for the morning load-up.'
    },
    presenterTips: [
      'Verify that advance "Tree Work Ahead" signs are in the truck before rolling out.',
      'Check that all crew members have clean, reflective high-vis vests.'
    ]
  }
];
