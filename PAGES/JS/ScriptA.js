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
        setTeamLogoAndName('PICTURES/MARSOC.png', 'Marine Special Operations Command');
    } else if (selectedTeam === 'team2') {
        setTeamLogoAndName('PICTURES/RRSR.png', '1st Scout Ranger Regiment <br>[Philippines] <br><br> 75th Ranger Regiment [United States]');
    } else if (selectedTeam === 'team3') {
        setTeamLogoAndName('PICTURES/SEALRR.png', 'SEAL TEAM 6 <br><br> 75th Ranger Regiment');
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
        setLocationDescription('21.4467° N, 157.7844° W | <strong>KANEOHE BAY, Hawaii</strong><br><br> The United States Navy is celebrating their <strong>Founding Anniversary</strong>. They want to showcase the capabilities of each unit through a field demonstration at the <strong>Marine Corps Air Station</strong>. <br><br>The base commander wants units who are capable to do a <strong>HALO jump</strong> and execute mock operations on the grandstand.');
    } else if (selectedLocation === 'location2') {
        setLocationDescription('5.9950° N, 121.1490° E | <strong>SULU, Philippines</strong><br><br> The Philippine\'s Military Intelligence Division together with the FBI have located a possible hideout for <strong>Abdul Rahim</strong> a notorius bomb maker, an apprentice of the late Zulkifli Abdir alias "Marwan". <br><br> Philippine military is offering their <strong>1st Scout Ranger Regiment</strong> unit to aid with the operation. <br><br> Intel suggests that the <strong>land navigation</strong> will be challenging due to the thick jungles and steep terrains. Approximate hostile count in the area is <strong>50+ Abu Sayaff Fighters.</strong>');
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
    'location2': {
        'team2': { 'HK416': 0, 'HK416 Suppressed': 10, 'First Aid Kit': 5, 'Satchel Charge' : 5, 'Parachute' : 0, 'Flashbang' : 0, 'Frag Grenade' : 10, }
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
            'team1-location2': 'Mission Failed. The Marines had a hard time locating the target area, and was overwhelmed.',
            'team3-location2': 'Mission Partial Success. The SEALs and Rangers took too long to navigate through the jungles, HVT escaped before they were able to reach the AO. All hostile forces eliminated.',
            'team2-location1': 'The people were confused on why the Philippine Scout Rangers were present. The Base Commander wants to have a word.',
            'team1-location1': 'The Marines were happy seeing their own Tier 1 units perform demonstrations.',
        };

        const promptKey = `${team}-${location}`;
        const promptMessage = prompts[promptKey] || 'Error';
        alert(promptMessage);
    }
}



