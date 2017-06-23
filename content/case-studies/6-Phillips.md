---
id: "6"
title: Moving with the Times
subtitle: The Refurbishment and Restoration of a Choreographed Robotic Arm
type: essay
contributor:
 - first_name: Sherry
   last_name: Phillips
   bio: Sherry Phillips is conservator of contemporary art at the Art Gallery of Ontario, Toronto. She has a degree in microbiology and zoology from the University of Toronto and is a graduate of the Conservation Program at Queen’s University (Kingston, Ontario). Her work with contemporary objects led to a focus on nontraditional materials, from plastic to electronics to taxidermy specimens to living systems.
 - first_name: Marcel
   last_name: Verner
   bio: Marcel Verner is a professional engineer (PEng, Canada) with degrees in electrical and mechanical engineering. At the National Research Council of Canada, he researched robotics for use in medical and automotive industries. Currently at PV Labs in Burlington, Ontario, he is responsible for the design and development of aerial robotic imaging systems. He loves a good technical challenge.
abstract: |
    *As Yet Untitled* (1992–95), a robotic arm and photograph installation by Toronto-based artist Max Dean, was a critical success from its first exhibition, but it is also a temperamental and unreliable machine. The refurbishment project for this kinetic work at the Art Gallery of Ontario (AGO) was initiated by a loan request from a Montreal gallery for a 2013 exhibition. Like most variable-media works of art, *As Yet Untitled* challenged the traditional framework for the conservation of art. To successfully restore it to working order, a volunteer mechatronics engineer and the artist provided crucial support for conservation staff.
weight: 204
---

## Introduction

Without loan requests, some of the most fascinating and challenging conservation projects would end up languishing on to-do lists. Complex projects tend to be event-driven rather than the result of strategic long-term planning ({{<q-cite "Smithsonian Institution 2010" "">}}). The restoration of *As Yet Untitled* began in 2013 with a loan request from VOX, Centre de l’Image Contemporaine, a leading public gallery in Montreal. To loan the work, the Art Gallery of Ontario (AGO) had to ensure that it would operate reliably and without constant repairs. A review of the artwork’s file revealed that *As Yet Untitled* had been popular, engaging, and a critical success but was also considered a temperamental and seemingly incomprehensible machine.

The robotic arm and photograph installation *As Yet Untitled* (1992–95) was created by Toronto-based artist Max Dean. It was first exhibited at the AGO in 1996 and eventually acquired as part of the permanent collection in 2007, with full knowledge of its history and the challenges it presented. Before coming into the collection, the piece had toured internationally with Dean and his technical assistants.[^1] As with most kinetic art, maintenance is essential to the operation and appreciation of the piece. *As Yet Untitled* was developed and constructed in the artist’s studio with a team of mechanical and computer specialists, whom Dean describes as “tinkerers.”[^2]

## Overview of the Installation

{{< q-figure id="6.1" >}}

In *As Yet Untitled* ([fig. 6.1](#6.1)), found photographs are presented to the viewer by a robotic arm. The motion is relentless; the robot operates whether or not someone is present. The arm is programmed to pick up a photograph from the feeder on the right, present it to the viewers, and then wait a few seconds for a response before proceeding. Viewers can intervene by covering one or both of the hand silhouettes in front of them, and the robot will place the photo in an archive box on the left. Should viewers choose not to act (or if no one is present), the robot will place the photo in a shredder, and the shredded photo will be conveyed to a pile. The robot runs continuously when the gallery is open to the public.

What do strangers—the viewers observing the robot’s presentation—choose to do with someone else’s memory embodied in the photograph: save it or shred it? *As Yet Untitled* explores technology and obsolescence, trust, power, connection, and the relationship of the viewer to the machine.

The installation is reminiscent of a choreographed performance, and the actions in the performance should be precisely replicated each cycle. The robot’s joint positions are like gestures, and the sequence of motion is like a dance; all are controlled by the program, which is composed of lines of code, a numerical quantification of movement. The code specifies points in space, geometric coordinates that define the dance composition, which can be captured like a performance score with the state machine diagram, a flowchart of actions describing the behavior of a system governing the operation of the artwork known as *As Yet Untitled*.

*As Yet Untitled* had not been installed for several years and had the reputation of being unreliable. Fortunately, the artist is based in Toronto and was keen to participate in the project. He is remarkably well connected to a diverse community of professionals and was able to reach out to Marcel Verner, a systems engineer with a strong commitment to volunteerism. Phillips readily acknowledges that the restoration project would not have been possible without Verner’s generous participation and Dean’s patience with the minutiae of restoration. Verner in turn knew of Dr. Richard Voyles, whose company, Mark V Automation Corp, specializes in retrofitting Unimation Puma technology. In addition to this happy confluence, VOX, the gallery in Montreal that requested the loan, was willing to share in the cost of the restoration.

## Stage One: Opening the Crates

As we began to work more deeply with the components, we realized that there would be two stages to the restoration process: pre- and post-exhibition at VOX. Stage one focused on bringing *As Yet Untitled* to a minimum level of viability for the loan. Various components of the installation still worked, but the robot controller was nonfunctional and the original operational program was obsolete. We repaired or replaced some mechanical aspects of the installation, specifically the air compressor and conveyor motor, and installed upgraded software and safety protocols, but the artwork would still require considerable support through the entire exhibition. All studio-built furniture components such as stands or supports were in excellent condition with no need for intervention.

Stage two would begin when *As Yet Untitled* was returned to the AGO; that is, completing the programming and, ultimately, amending the robot’s unfortunate reputation.

Preparing the robot and installation components for loan was a logistical challenge. We were awash in unassembled and scattered components, too many for the conservation studio. We used empty gallery spaces, but we were displaced four times before our work was complete ([fig. 6.2](#6.2)).

{{< q-figure id="6.2" >}}

### Photographs

Originally the supply of found photographs was sourced through unclaimed stock at photographic developing shops, or through donations. Newly sourced photos for the loan to VOX, however, produced an unexpected complication: contemporary photo paper has a different texture than the photo paper commonly used in 1996, and the photo separator tabs on the front edge of the feeder could no longer reliably separate the photos. The shredder can manage up to three photographs without jamming but, ideally, only one photo at a time should be presented to the visitor. A colleague with experience working in mail rooms recalled that envelope sorters use brushes to separate mail. Using a band saw, we cut a new bristle brush into single rows and attached them to the delivery end of the photo feeder. This worked well. This solution was intended to be temporary, but Dean felt the change was in the spirit of the piece so the brushes remain in place.

### Photo Feeder

Pneumatic technology is used to pick up the photos in the mechanical feeder as well as supply air to the robot gripper. The air compressor is located under the conveyor belt. Ideally, a single photograph is brought forward by the pneumatic suction cup and picked up by the robot gripper.

Dean supplied two air compressors but neither one worked; we acquired a new compressor of the same brand. Our reasoning for replacement was simple: for some components, it’s much less expensive to replace than to repair. The new model doesn’t quite fit into the available space under the conveyor, but it is much quieter than the original. Dean’s original choice of compressor was based on the quietest unit then available so viewers can better focus on the robot. We decided not to adapt the conveyor stand to hide the larger compressor; the slight extra length of the new compressor is not visible from the viewer’s main vantage point and an intervention would have involved a substantial rebuild.

### Hands

Photoelectric cells are embedded in the silhouettes of the hands. The sensors register a visitor’s intervention (the action of covering one or both hands) to signal the robot to archive a photo. If the hands are not covered, the robot shreds the photo.

### Archival Box

Photos selected for archive acknowledge the visitor’s conscious decisions to save specific images, and these are stored post-exhibition as archival material.

### Shredder and Conveyor

The conveyor belt and motor are commercially sourced but custom-sized for the installation. The original conveyor motor was refurbished by an outside company. The seals had decayed and oil had leaked while the artwork was in storage. Changing our storage approach to establish a maintenance protocol, that is, rotating the unit to redistribute the oil and preserve the seals, will improve the preservation of mechanical elements.

The average shredding capacity of the robot is eighty photos (4 × 6 in.) an hour. There are two paper shredder units, and both are currently in working order. They could be replaced with new models provided they fit into the studio-made shredder housing and create long strips of photographs. Shredded photos are discarded discreetly at the end of the exhibition period.

### Robot, Controller, and Software

Dean chose a Unimation Puma 550 industrial robot arm with a gripper attachment mounted on a studio-built metal stand. These robots—relatively simple to program, operate, and repair—can still be found in robotics classrooms as teaching tools. Dean originally thought he would build his own robotic arm but chose the Puma 550 after a visit to Antenen Robotics in West Chester, Ohio.

The robotic arm appeared to be sound mechanically and only required general maintenance, including re-greasing the joints. Grease in robot joints can leak, and some residue on the exterior of the arm case seems to be inevitable. These joints should be moved and greased regularly.

A chassis unit containing the controller, computer and monitor, and I/O (input/output) module slides under the robot stand and is accessed by the operator from behind the robot. The I/O module and circuits ([fig. 6.3](#6.3)) are connected to the controller, receiving or generating signals to the feeder, shredder, and robot arm. The computer manages the software program that contains the commands controlling the action of the robot.

{{< q-figure id="6.3" >}}

The 1980s-era Unimation Puma 550 robot was initially controlled by a closed, dedicated, terminal-based architecture similar in structure to a mainframe computer system. Its sequencing was programmed in Variable Assembly Language (VAL), a novel language in its time but now obsolete. Dean and his tinkerers had scripted the original operational program, that is, the choreography for *As Yet Untitled* in VAL. The controller houses the computer unit, power supplies, and servo amplifiers needed to power the robot’s joint motors. Over the years, while touring with Dean, the unit experienced several hardware failures, necessitating upgrades that removed the mainframe hardware and replaced it with laptop-based emulators, while still allowing the VAL script to be preserved.

Ultimately, a hardware failure in the original controller meant that it was no longer suitable for use and needed to be replaced. The options were to replace the Unimation controller or to change the architecture to something more contemporary. While it was technically possible to get a refurbished or used replacement, it would not have been cost-effective, and the age of the hardware meant that there was significant risk that it would not be successful. Switching the controller architecture to a commercial off-the-shelf (COTS) design would be more cost-effective and increase the unit’s reliability and sustainability.

The new controller from Mark V Automation was hardwired to the existing robot interface, and it replaced the motor-power amplifiers with commercially available amplifiers based on open standards. All signals to and from the robot pass through the controller and perform real-time calculations that control the arm’s movements and positions. The operational program on the computer is transmitted to the robot through the controller.

The controller’s software platform was based on Mark V Automation’s recommendation for use with their hardware. The computer runs MS-DOS, an extremely efficient operating system (OS) that allows for simplified, low-level device control. Even though MS-DOS is technically obsolete, its very lightweight system overhead still makes it favorable for embedded systems control. The Puma control software is written in the C programming language, using open standards and reusable device drivers and components. This selection in programming techniques ensures that the source code will be part of the piece and archived. If there is future need to revise the software, it should pose no challenges.

{{< q-figure id="6.4" >}}

{{< q-figure id="6.5" class="float-right">}}

The purchase of the new controller, a cost-effective means of updating and refurbishing the artwork, is within Dean’s COTS concept. There should be no artist’s quirks in the build or program. Reentering the code in contemporary programming language with new components also aligns with the artist’s design/build strategy; the operational part of *As Yet Untitled* is off-the-shelf, not a custom build with personalized circuit boards and mechanical components that need to be preserved.

The original scripting of the commercial software in the 1990s had not been migrated, nor had the sequencing been extracted in a format readable by humans, and the software resided on two laptops of questionable operational status ([fig. 6.4](#6.4)) and a set of floppy disks. The artist’s belief in multiple redundancies paid off: it was possible to retrieve the sequencing choreography and software flow of the installation from one of the laptops. This information was converted to a state machine or flowchart of actions ([fig. 6.5](#6.5)), software-speak for a flowchart describing the behavior of a system that governs the operation of the exhibit that the viewer experiences as *As Yet Untitled*. The sequencing experienced as *As Yet Untitled* was re-sequenced using the new robot control software.

### Documentation

We created two manuals: one for a programmer, and another for the relatively nontechnical installer. The programmer manual will assist in the identification of communication links and faults between components and controller. The installer’s manual is image-heavy, with a lot of repetition to the instructions.

## Stage Two: Post VOX

*As Yet Untitled* operated reliably in Montreal—daily for more than seven weeks—monitored by an in-house installation technician (with telephone and e-mail access to the project engineer for advice), but the program and refurbishment was not complete.

### Robot

After the robot returned to AGO, coding and subsequent testing of commands in the script eventually revealed that index pulses were not working properly. Verner found the root cause in failing encoder signals in arm-joint motor number 3. An encoder is an electrical device used to measure position in space, and index pulses, also called reference pulses or points, are signals generated by the encoder. We could either replace the malfunctioning joint motor, or try to write the code around it and maintain a temperamental machine; we opted for replacement.

We also realized that a significant reason for the machine’s unfortunate reputation was that its position never returned to “zero” after each session. The Puma 550 does not know or remember where it is in space upon start-up; it must be programmed to perform a calibration routine to ensure the program can be precisely replicated for each operational session. Failure to have the machine recalibrate over several installations had created a domino effect of missteps and deviations in its operation, with subsequent repairs or resets. Appropriate maintenance routines and installation protocols are only possible with a thorough understanding of the machine.

The original laptops and controller are in storage. They are now part of <em>As Yet Untitled</em>’s history. The new controller produced by Mark V Automation and the newly written software may undergo the same fate someday.

### Sequencing of Motion

<em>As Yet Untitled</em>’s original 1996 performance at the AGO and its subsequent installations were not fully documented. Dean’s participation in preparation for the loan to VOX, however, meant that we were able to build upon the program extracted from the old laptop.

It was necessary to change the original motion routines to better align with the actual limits of the machine and the program. A new start-up process for alignment of components has been added, as well as a few subtle changes from the original choreography, because the original performance was not coded in accordance with the robot’s functional limits. Dean fully supports the variation and believes that an enriched understanding of the machine through a specialist engineer’s participation has led to overall improvement in its operation and function and, consequently, the performance. We adjusted, for example, velocities and joints. The arm’s original motion—a single sweep, with a large wrist flip from feeder to presentation to the viewer—resulted in slow speed, a droop in the arm, and a jerky motion at the waist joint. The motion was changed so that the wrist flip occurred at the conclusion of the arm sweep, resulting in a smoother, slightly faster arm sweep and concluding with a smaller wrist gesture before the final extension and presentation to the viewer.

### Safety

Some changes to the installation were necessary for health and safety. Working to provincial electrical safety standards is AGO policy, and we also reviewed industrial safety standards for robotic installation. Two emergency stops have been added, one on the controller, another on an auxiliary box, which is meant to be moved to an accessible location during operation of the piece. At least two people must be involved in the installation, and there must be an attendant close to the robot at all times.

Stanchions and cord to indicate a perimeter barrier are original to the piece. These will be maintained, but we are now in conversation about options for adding an industrial-type perimeter safety feature, such as a light curtain and intrusion-detection technology. It is important to remember that the robot cannot sense that someone is in the way; it could do serious harm. Insurance, risk tolerance, and inspection by external safety authorities are real considerations.

We maintained programmed responses to unexpected variables, like a jammed shredder or no photo pick-up. This seems like improvisation and contributes to the tendency of visitors to anthropomorphize the robot, to believe the robot is thinking and responding. Now, however, error prompts are coupled with instructions for the operator in accessible language on the monitor at the back of the work, and supported by instructions in the operational manual ([fig. 6.6](#6.6)). The robot also has its own Gmail and Dropbox accounts so that software updates and troubleshooting can be performed remotely if required.

{{< q-figure id="6.6" >}}

## Future

There is no current need to replace the robot or other major components of the installation, but the artist has said it is an acceptable option. Working closely with the artist means we can record his tolerances for future preservation strategies.

The industrial look of the arm, its choreography of movement, and the potential for viewers to anthropomorphize the robot are essential, but the styling of the Puma arm and its control unit is considered secondary. Dean originally chose or designed the various components of the installation because they are COTS; they are meant to be repairable or replaceable—that is, “future-proof.”

Artists and their studio assistants may develop a project with incomplete knowledge of the technology. Dean acknowledges this was true for *As Yet Untitled*, and we addressed this deficit under his guidance while maintaining the installation’s original appearance. An evolution of the piece is inevitable, as the technology and components needed to support the kinetic installation change over time. Robotics and the associated mechanics or electronics are simply a means of solving a problem for Max Dean, not an end in themselves.[^3]

If there is a major shift in computers/robotics, equipment, and software, then all processors, the I/O board, and written software may have to be replaced. Any program or computing language compatible with robots in general should work as long as the programmer follows the state diagram and documented lines of code. We have been able to largely preserve the original integrity of the installation; our future colleagues may be faced with very different decisions, but they will be guided by documentation of Dean’s intention. There is a range of options for future decisions on behalf of *As Yet Untitled*, options that ultimately are to keep the work kinetic.

## Conclusion

According to Max Dean, this restoration project took *As Yet Untitled* to a state that he would have wanted in the original but which his early team of tinkerers was incapable of realizing.[^4] Our project has resulted in an iteration of the original computer program. It is a version of the old, based on a clearer understanding of the machine and with new and necessary safety features. The artist’s collaboration on the project, together with a conservator’s tendency toward restraint and an engineer’s ingenuity, meant that the result is not an interpretation or relic of the original, but rather a reliable and robust performance by the original mechanical components. Working collaboratively with specialists and the artist was necessary and complicated but also professionally and personally enriching.

If the restoration of *As Yet Untitled* had not been completed after the Montreal loan, it would have been difficult for others to pick up where we left off, and appropriate restoration may have been impossible. Like any kinetic object, it will remain susceptible to mechanical wear and tear. As the original components age, and as replacement parts become obsolete, the robot may even regain its temperamental attitude. Building on our work, however, a new team should be able to face the challenge with confidence.

## Notes

[^1]: Art Gallery of Ontario, Canada, 1996; *d’APERTutto*, Venice Biennale, Italy, 1999; *The Fifth Element*, Städtische Kunsthalle Düsseldorf, Germany, 2000; *Voici: 100 ans d’art contemporain/Look: 100 Years of Contemporary Art*, Palais des Beaux-Arts, Brussels, Belgium, 2000; *Quality Control*, Site Gallery, Sheffield, England, 2001; *Iconoclash*, ZKM, Karlsruhe, Germany, 2002; *The Bigger Picture*, Ottawa Art Gallery, Ottawa, Canada, 2003; *Damage Done: Materializing the Photographic Image*, Prefix, Toronto, Canada, 2005; *Drone: The Automated Image*, VOX, Centre de l’Image Contemporaine, during Le Mois de la Photo à Montréal, Canada, 2013.

[^2]: Sherry Phillips, in conversation with Max Dean, AGO, 2015.

[^3]: {{<q-cite "Langill 2006" "">}}, Question 4.

[^4]: Sherry Phillips, in conversation with Max Dean, April 8, 2016.
