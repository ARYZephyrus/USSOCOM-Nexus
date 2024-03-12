function increaseQuantity(button, index) {
    var span = document.querySelectorAll('.quantity-buttons span')[index];
    if (span) {
        var quantity = parseInt(span.textContent);
        span.textContent = quantity + 1;
    }
}

function decreaseQuantity(button, index) {
    var span = document.querySelectorAll('.quantity-buttons span')[index];
    if (span) {
        var quantity = parseInt(span.textContent);
        if (quantity > 0) {
            span.textContent = quantity - 1;
        }
    }
}

const teamSelect = document.getElementById('team-select');
const locationSelect = document.getElementById('location-select');
const teamLogo = document.getElementById('team-logo');
const locationDescription = document.getElementById('location-description');
const selectTeamLogo = document.getElementById('select-team-logo');
const equipmentSection = document.querySelectorAll('.equipment-section');
const proceedButton = document.querySelector('.proceed-button');

equipmentSection.forEach(section => {
    section.style.display = 'none';
});
proceedButton.style.display = 'none';

teamSelect.addEventListener('change', handleTeamChange);
locationSelect.addEventListener('change', handleLocationChange);

function handleTeamChange() {
    const selectedTeam = teamSelect.value;
    if (selectedTeam === 'team1') {
        setTeamLogoAndName('PICTURES/SAD.png', 'CIA Special Activities Division');
    } else if (selectedTeam === 'team2') {
        setTeamLogoAndName('PICTURES/SASDELTA.png', 'Special Air Service <br>[United Kingdom] <br><br> Delta Force <br> [United States]');
    } else if (selectedTeam === 'team3') {
        setTeamLogoAndName('PICTURES/GIGNDELTA.png', 'Groupe d\'intervention de la Gendarmerie nationale<br>[France] <br><br> Delta Force <br> [United States]');
    } else if(selectedTeam === "team") {
        setTeamLogoAndName('PICTURES/JSOC.png', '');
    }
    else {
        hideTeamLogo();
        hideEquipment();
    }
    updateEquipmentVisibility();
}

function handleLocationChange() {
    const selectedLocation = locationSelect.value;
    if (selectedLocation === 'location1') {
        setLocationDescription('52.5736° N, 0.2429 ° W | <strong>PETERBOROUGH, United Kingdom</strong><br><br> There has been an attack of 2 suicide bombers at the <strong>Queens Gate Shopping centre</strong>, shortly after <strong>15+ armed men</strong>; who are believed to be from the terrorist organization ISIS, entered the building and held a few people hostage. <br><br> The <strong>entire mall is locked down</strong>, covering entrances and building fortifications for entry teams. <br><br> We have overseas operators and the UKSF conducting military exercises at RAF Lakenheath. <br><br> The attackers demand to withdraw U.S. Troops from Kuwait or they will detonate <strong>a bomb</strong> with a blast radius of 50km.');
    } else if (selectedLocation === 'location2') {
        setLocationDescription('48.871063°N 2.20257983°E | <strong>SURESNES, France</strong><br><br> <strong>10 men</strong> have seized control of a nearby Hospital in France. Equipped with <strong>high powered weapons and explosives</strong> the local police are overwhelmed. <br><br> The French SWAT are now staging and planning their course of action but they believe they could use the help of our <strong>operators stationed in Hexagone Balard</strong>. <br><br> We have at least <strong>6 operators on stand-by</strong>, waiting for orders. <br><br> Intel suggests that the most unexpected and safest entry is through the roof.');
    } else {
        setLocationDescription('SELECT A LOCATION')        
    }
    updateEquipment();
    updateEquipmentVisibility();
}

function setTeamLogoAndName(src, teamName) {
    teamLogo.src = src;
    teamLogo.style.display = 'inline-block';
    selectTeamLogo.style.display = 'none';
    document.getElementById('team-name').innerHTML = teamName;
}

function hideTeamLogo() {
    teamLogo.style.display = 'none';
    selectTeamLogo.style.display = 'block';
}

function setLocationDescription(description) {
    locationDescription.innerHTML = description;
}

function updateEquipmentVisibility() {
    const selectedTeam = teamSelect.value;
    const selectedLocation = locationSelect.value;
    const isTeamSelected = selectedTeam !== '' && selectedTeam !== 'team'; 
    const isLocationSelected = selectedLocation !== '' && selectedLocation !== 'location';

    if (isTeamSelected && isLocationSelected) {
        equipmentSection.forEach(section => {
            section.style.display = 'table-row';
        });
        proceedButton.style.display = 'table-row';
    } else {
        hideEquipment();
        proceedButton.style.display = 'none';
    }
}

const equipmentSets = {
    'location1': {
        'team2': { 'HK416': 6, 'HK416 Suppressed': 0, 'First Aid Kit': 5, 'Satchel Charge' : 7, 'Parachute' : 0, 'Flashbang' : 10, 'Frag Grenade' : 4, }
    },
    'location2': {
        'team3': { 'HK416': 0, 'HK416 Suppressed': 6, 'First Aid Kit': 3, 'Satchel Charge' : 6, 'Parachute' : 6, 'Flashbang' : 12, 'Frag Grenade' : 4, }
    }
};

function hideEquipment() {
    equipmentSection.forEach(section => {
        section.style.display = 'none';
    });
}

function updateEquipment() {
    const selectedLocation = locationSelect.value;
    const selectedTeam = teamSelect.value;
    const selectedEquipment = equipmentSets[selectedLocation]?.[selectedTeam] || {};

    equipmentSection.forEach(section => {
        const sectionId = section.getAttribute('id');
        const quantitySpan = section.querySelector('span');
        if (quantitySpan) {
            const equipmentName = sectionId; 
            const isIncluded = selectedEquipment.hasOwnProperty(equipmentName);
            section.style.display = isIncluded ? 'table-row' : 'none';
            if (!isIncluded) {
                quantitySpan.textContent = '0';
            }
        }
    });
}

function resetQuantities() {
    const quantitySpans = document.querySelectorAll('.quantity-buttons span');
    quantitySpans.forEach(span => {
        span.textContent = '0';
    });
}
function proceed() {
    const team = teamSelect.value;
    const location = locationSelect.value;
    const equipmentQuantities = {};
    
    const requiredEquipment = equipmentSets[location]?.[team] || {};
    
    if (Object.keys(requiredEquipment).length > 0) {
        document.querySelectorAll('.quantity-buttons span').forEach((span, index) => {
            const equipmentName = span.parentElement.nextElementSibling.textContent.split('\n')[0].trim();
            equipmentQuantities[equipmentName] = parseInt(span.textContent) || 0;
        });
        
        let success = true;
        let message = '';
        
        console.log("Equipment Quantities:", equipmentQuantities);
        console.log("Required Equipment:", requiredEquipment);
        
        Object.keys(requiredEquipment).forEach(item => {
            if (!(item in equipmentQuantities) || equipmentQuantities[item] < requiredEquipment[item]) {
                success = false;
                message = 'Operation Aborted: Insufficient Equipment!';
            }
        });
        
        if (success) {
            alert('Operation On-going');
            setTimeout(function() {
                alert('Operation Success!');
                resetQuantities();
            }, 5000);
        } else {
            alert(message);
        }
    } else {
        const prompts = {
            'team1-location1': 'Mission Failed. The CIA SAD were overwhelmed, you could have sent someone more capable.',
            'team1-location2': 'Mission Failed. The CIA SAD Operators were not HALO qualified. They used helicopters to gain access through the roof, the men inside were alerted. Operators suffered 3 KIAs, and aborted the mission',
            'team3-location1': 'Mission Failed. the UK Commander was confused on why you called GIGN for the operation. They already had their operators on the way.',
            'team2-location2': 'Mission Failed. it took too long to wait for the SAS, GIGN was forced to execute the operation on their own.',
        };

        const promptKey = `${team}-${location}`;
        const promptMessage = prompts[promptKey] || 'Error';
        alert(promptMessage);
    }
}



