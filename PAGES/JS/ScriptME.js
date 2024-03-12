// INCREASE QUANTITY FUNCTION
function increaseQuantity(button, index) {
    var span = document.querySelectorAll('.quantity-buttons span')[index];
    if (span) {
        var quantity = parseInt(span.textContent);
        span.textContent = quantity + 1;
    }
}

// DECREASE QUANTITY FUNCTION
function decreaseQuantity(button, index) {
    var span = document.querySelectorAll('.quantity-buttons span')[index];
    if (span) {
        var quantity = parseInt(span.textContent);
        if (quantity > 0) {
            span.textContent = quantity - 1;
        }
    }
}

// ELEMENTS
const teamSelect = document.getElementById('team-select');
const locationSelect = document.getElementById('location-select');
const teamLogo = document.getElementById('team-logo');
const locationDescription = document.getElementById('location-description');
const selectTeamLogo = document.getElementById('select-team-logo');
const equipmentSection = document.querySelectorAll('.equipment-section');
const proceedButton = document.querySelector('.proceed-button');

// HIDE EQUIPMENT AND PROCEED BUTTON INITIALLY
equipmentSection.forEach(section => {
    section.style.display = 'none';
});
proceedButton.style.display = 'none';

teamSelect.addEventListener('change', handleTeamChange);
locationSelect.addEventListener('change', handleLocationChange);

// TEAM SELECTION HANDLER
function handleTeamChange() {
    const selectedTeam = teamSelect.value;
    if (selectedTeam === 'team1') {
        setTeamLogoAndName('PICTURES/DELTA.png', 'Delta Force');
    } else if (selectedTeam === 'team2') {
        setTeamLogoAndName('PICTURES/DEVGRU.png', 'SEAL Team 6 DEVGRU');
    } else if (selectedTeam === 'team3') {
        setTeamLogoAndName('PICTURES/24THSTS.png', '24th Special Tactics Squadron');
    } else if(selectedTeam === "team") {
        setTeamLogoAndName('PICTURES/JSOC.png', '');
    }
    else {
        hideTeamLogo();
        hideEquipment();
    }
    updateEquipmentVisibility();
}

// LOCATION SELECTION HANDLER
function handleLocationChange() {
    const selectedLocation = locationSelect.value;
    if (selectedLocation === 'location1') {
        setLocationDescription('31.617834°N, 65.735233°E | <strong>KANDAHAR, Afghanistan</strong><br><br><strong>Hassan Ahmad</strong>, an arms dealer, is bringing supplies to Al-Qaeda to an unknown location. POTUS does not want to risk the ammunition and equipment reaching its destination before we attack. <br><br><strong>Intercept the convoy</strong> near Kandahar. <em>Destroy all equipment</em> and <em>confirm the kill on Hassan</em>. <br><br>Intel suggests that there will be 2 APCs, 4 Supply Trucks, and 2 Technicals.');
    } else if (selectedLocation === 'location2') {
        setLocationDescription('34.566042°N, 69.212069°E | <strong>KABUL, Afghanistan</strong><br><br>A group of Taliban fighters hijacked one of our C-130s in <strong>Kabul Airport</strong>, they are holding hostage <strong>5 of our Air Force Civilian Personnel</strong>, we cannot trust the local SWAT Team for this, send operators. <br><br>Act fast, every second is critical. <br><br> Intel says that there are <strong>8 terrorists</strong> inside the aircraft.');
    } else {
        setLocationDescription('SELECT A LOCATION')        
    }
    updateEquipment();
    updateEquipmentVisibility();
}

// SET LOGO AND TEAM NAME
function setTeamLogoAndName(src, teamName) {
    teamLogo.src = src;
    teamLogo.style.display = 'inline-block';
    selectTeamLogo.style.display = 'none';
    document.getElementById('team-name').textContent = teamName;
}

// HIDE TEAM LOGO INITIALLY
function hideTeamLogo() {
    teamLogo.style.display = 'none';
    selectTeamLogo.style.display = 'block';
}

// SETS LOCATION DESCRIPTION
function setLocationDescription(description) {
    locationDescription.innerHTML = description;
}



// VISIBILITY OF EQUIPMENT TABLE AND PROCEED BUTTON
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



// EQUIPMENT NEEDED FOR TEAMS AND LOCATION 
const equipmentSets = {
    'location1': {
        'team1': { 'HK416': 8, 'HK416 Suppressed': 0, 'First Aid Kit': 4, 'Satchel Charge' : 4, 'Parachute' : 0, 'Flashbang' : 0, 'Frag Grenade' : 4, },
        'team2': { 'HK416': 12, 'HK416 Suppressed': 0, 'First Aid Kit': 6, 'Satchel Charge' : 8, 'Parachute' : 0, 'Flashbang' : 0, 'Frag Grenade' : 6, },
    },
    'location2': {
        'team3': { 'HK416': 0, 'HK416 Suppressed': 8, 'First Aid Kit': 5, 'Satchel Charge' : 2, 'Parachute' : 0, 'Flashbang' : 6, 'Frag Grenade' : 0, }
    }
};

// Function to hide equipment sections
function hideEquipment() {
    equipmentSection.forEach(section => {
        section.style.display = 'none';
    });
}

// Function to update equipment
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

// RESET QUANTITIES
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
    
    // Check if the selected team is eligible for the selected location
    if (Object.keys(requiredEquipment).length > 0) {
        document.querySelectorAll('.quantity-buttons span').forEach((span, index) => {
            const equipmentName = span.parentElement.nextElementSibling.textContent.split('\n')[0].trim();
            equipmentQuantities[equipmentName] = parseInt(span.textContent) || 0;
        });
        
        let success = true;
        let message = '';
        
        console.log("Equipment Quantities:", equipmentQuantities);
        console.log("Required Equipment:", requiredEquipment);
        
        // Check if there's enough equipment for the operation
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
            'team1-location2': 'D Boys are highly skilled, but there other units who are more trained for this situation',
            'team2-location2': 'SEAL TEAM 6 may be capable but they are not the best for this situation',
            'team3-location1': 'Mission Failed! The 24th STS are not Direct Action units.'
        };

        const promptKey = `${team}-${location}`;
        const promptMessage = prompts[promptKey] || 'Error';
        alert(promptMessage);
    }
}
