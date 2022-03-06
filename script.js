//Katrine and I have been working on this assignment together, why there migth be simmilarities in the code.

"use strict";

window.addEventListener("DOMContentLoaded", start);

const Student =
{
    firstname: "default first name",
    lastname: "default lastname",
    middlename: "default middle name",
    nickname: "default nick name",
    gender: "default gender",
    house: "default house",
    blood: "",
    image: "default image",
    expelled: "false",
    awesome: false
}
    ;

const allStudents = [];
const expelledStudents = [];



const settings = {
    filterBy: "*",
    sortBy: "",
    sortDir: "az",
    search: "",
    hacked: false
}



function start() {
    console.log("started");
    //adds eventlistener to button
    registerButtons();

    //load my json
    loadJSON();


}



async function loadJSON() {

    //for student data
    // await response of fetch call
    const response = await fetch('https://petlatkea.dk/2021/hogwarts/students.json');
    // proceeds once fetch is done
    const jsonData = await response.json();

    //for blood data
    // await response of fetch call
    const responseB = await fetch('https://petlatkea.dk/2021/hogwarts/families.json');
    // proceeds once fetch is done
    const jsonDataB = await responseB.json();

    prepareObjects(jsonData);
    addBloodStatus(jsonDataB);
}



function prepareObjects(jsonData) {

    jsonData.forEach(jsonObject => {

        //create new object
        const student = Object.create(Student);

        //Extracting and cleaning data from jsonobject
        let originalname = jsonObject.fullname.trim();

        originalname = originalname.split(' ');

        // declaring variables for name parts, plus defining the firstname and capitalising.
        let firstName = originalname[0].charAt(0).toUpperCase() + originalname[0].substring(1).toLowerCase();
        let fullName;
        let middleName = "";
        let lastName = "";
        let nickName;


        //if statement for students with 2 names
        if (originalname.length == 2) {
            lastName = originalname[1].charAt(0).toUpperCase() + originalname[1].substring(1).toLowerCase();
            fullName = firstName + " " + lastName;

        }
        //for students with 3 names
        else if (originalname.length == 3) {
            middleName = originalname[1].charAt(0).toUpperCase() + originalname[1].substring(1).toLowerCase();
            lastName = originalname[2].charAt(0).toUpperCase() + originalname[2].substring(1).toLowerCase();
            fullName = firstName + " " + middleName + " " + lastName;

            //for names with nicknames instead of middlenames
            if (middleName.includes('"')) {
                middleName = "";
                nickName = originalname[1];
                let firstQuotationmark = nickName.indexOf('"');
                let lastQuotationmark = nickName.lastIndexOf('"');

                //removes the "" around the name AND capitalizes the name
                nickName = nickName.substring(firstQuotationmark + 1, lastQuotationmark).charAt(0).toUpperCase() + nickName.substring(firstQuotationmark + 1, lastQuotationmark).substring(1).toLowerCase();

            }

        }
        //declaring the gender and house and capitalizes
        let gender = jsonObject.gender;
        gender = gender.charAt(0).toUpperCase() + gender.substring(1).toLowerCase();

        let house = jsonObject.house.trim();
        house = house.charAt(0).toUpperCase() + house.substring(1).toLowerCase();

        //just some console.logs for testing
        /*   console.log(fullName);
          console.log("firstname:" + firstName);
          console.log("middlename:" + middleName);
          console.log("nickname:" + nickName);
          console.log("lastname:" + lastName);
          console.log(gender);
          console.log(house); */

        //get image closure function - uses first and lastname for the imagefilename.
        function getImage(firstName, lastName) {
            let image
            if (lastName == "Patil") {
                image = `images/${lastName.substring(lastName.lastIndexOf(""), lastName.indexOf("-") + 1)
                    .toLowerCase()}_${firstName.toLowerCase()}.png`;
            } else {
                image = `images/${lastName.substring(lastName.lastIndexOf(""), lastName.indexOf("-") + 1)
                    .toLowerCase()}_${firstName.substring(0, 1).toLowerCase()}.png`;
            }
            return image;

        }


        //put cleaned data into the new object
        student.firstname = firstName;
        student.middlename = middleName;
        student.lastname = lastName;
        student.nickname = nickName;
        student.gender = gender;
        student.house = house;
        if (lastName) {
            student.image = getImage(firstName, lastName);
        } else student.image = "images/null.png";

        //add the object to the global allAnimals array
        allStudents.push(student);
    });

    buildList(allStudents);
    counter(allStudents);


}


function addBloodStatus(bloodType) {
    const purebloods = bloodType.pure;
    const halfbloods = bloodType.half;


    allStudents.forEach((student) => {
        if (halfbloods.includes(student.lastname)) {
            student.blood = "halfblood";
        } else if (purebloods.includes(student.lastname)) {
            student.blood = "pureblood";
        } else {
            student.blood = "muggle";
        }
    });

    buildList(allStudents);
}

function registerButtons() {
    document.querySelectorAll("[data-action='filter']")
        .forEach(button => button.addEventListener("click", selectFilter));


    document.querySelectorAll("[data-action='sort']")
        .forEach(button => button.addEventListener("click", selectSort));

    //Here I add eventlistener for my searchbar button
    document.querySelector(".searchInput").addEventListener("input", searchInput);

   

}


//filter
function selectFilter(event) {
    const filter = event.target.dataset.filter;
    console.log(`user selected: ${filter}`);
    setFilter(filter);
}

function setFilter(filter) {
    settings.filterBy = filter;
    buildList();
}

function filterList(filteredList) {


    if (settings.filterBy === "Hufflepuff") {
        filteredList = filteredList.filter(isHufflepuff);
    } else if (settings.filterBy === "Gryffindor") {
        filteredList = filteredList.filter(isGryffindor);
    } else if (settings.filterBy === "Ravenclaw") {
        filteredList = filteredList.filter(isRavenclaw);
    } else if (settings.filterBy === "Slytherin") {
        filteredList = filteredList.filter(isSlytherin);
    }

    function isHufflepuff(student) {
        return student.house === "Hufflepuff";
    }

    function isGryffindor(student) {
        return student.house === "Gryffindor";
    }

    function isRavenclaw(student) {
        return student.house === "Ravenclaw";
    }

    function isSlytherin(student) {
        return student.house === "Slytherin";

    }


    return filteredList;
}

//sorting
function selectSort(event) {
    const sort = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection;

    //toggle sort direction 
    if (sortDir === "az") {
        event.target.dataset.sortDirection = "za";
    } else {
        event.target.dataset.sortDirection = "az";

    }

    console.log(`user selected: ${sort} - ${sortDir}`);
    setSort(sort, sortDir);
}

function setSort(sortBy, sortDir) {
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildList();

}

function sortList(sortedList) {

    let direction = 1;
    if (settings.sortDir === "za") {
        direction = -1;
    } else {
        direction = 1;
    }



    sortedList = sortedList.sort(sortByThis);



    function sortByThis(studentA, studentB) {
        if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
            return -1 * direction;
        } else {
            return 1 * direction;
        }
    }


    return sortedList;

}

//set setting.search to vlaue from input
function searchInput(evt) {
    settings.search = evt.target.value;

    //HACKING the trick to enabling hack the system, type hack in searchbar
    if(settings.search.includes("hack")){
        document.querySelector(".searchInput").value = "";
        settings.search="";
        hackTheSystem();
    }
    buildList();
    
}


//here is my search function
function searchList(studentList) {
    let searchInput = settings.search.toUpperCase();
    console.log(settings.search);

 
    return studentList.filter((student) => {
        // write to the list with only those students in the array that has properties containing the search frase
        // comparing in uppercase so that m is the same as M
        // checking both firstnames, middle names and lastnames
        return (student.firstname.toUpperCase().includes(searchInput) || student.middlename.toUpperCase().includes(searchInput) || student.lastname.toUpperCase().includes(searchInput))
    });
}

//makes sure my filter and sort and search works together before displaying list, does the same for the expelled list
function buildList() {

 
    const currentList = filterList(allStudents);
    const sortedList = sortList(currentList);
    const searchedList = searchList(sortedList);

    const expelledList = filterList(expelledStudents);
    const sortedExpelledList = sortList(expelledList);
    const searchedExpelledList = searchList(sortedExpelledList);
//EKSTRA HACK FUNCTIONALITY makes sure that search doesnt work if system is hacked
/* if(settings.hacked){
    displayList(sortedList, sortedExpelledList);

}else */
    displayList(searchedList, searchedExpelledList);

}





//display list for both admitted and expelled students
function displayList(students, expelled) {


    // clear the list
    document.querySelector("#list").innerHTML = "";
    document.querySelector("#expelledlist").innerHTML = "";
    // build a new list
    students.forEach(displayStudent);
    expelled.forEach(displayStudent);

}






function displayStudent(student) {
    // create clone
    const clone = document.querySelector("template#studentTemplate").content.cloneNode(true);
    const article = clone.querySelector("#student");


    //decides which list the studnet should be appended to depending on if they are expelled or not



    // set clone data
    //fullname image and house.
    clone.querySelector("[data-field=fullname]").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
    clone.querySelector("[data-field=image]").src = student.image;
    // for students that have no middlename, or lastname,sets correct fullnames 
    if (student.middlename == "") {
        clone.querySelector("[data-field=fullname]").textContent = `${student.firstname} ${student.lastname}`;
    }
    if (student.lastname == "") {
        clone.querySelector("[data-field=fullname]").textContent = student.firstname;
    }

    //addStyles(student.house,article);
    clone.querySelector("[data-field=house]").src = `crests/${student.house}.png`;

    if (student.expelled == "true") {
        document.querySelector("#expelledlist").appendChild(clone);
        addStyles("expelled-student", article);
    } else {
        document.querySelector("#list").appendChild(clone);
    }




        //adds click eventlistener that calls the function showDetails for that student (the pop up view)
        article.addEventListener("click", () => showDetails(student));


    


}



function addStyles(addStyle, dest) {
    dest.className = "";
    dest.classList.add(addStyle);
}



function showDetails(student) {
    const popup = document.querySelector("#popup");
    const detailArticle = popup.querySelector("#studentDetail");


    resetDisplay();


    //shows fullname, firstname, lastnames, nicknames and middle names.
    popup.querySelector("[data-field=fullname]").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
    popup.querySelector("[data-field=firstname]").textContent = `Firstname: ${student.firstname}`;
    popup.querySelector("[data-field=middlename]").textContent = `Middlename: ${student.middlename}`;
    popup.querySelector("[data-field=lastname]").textContent = "lastname: " + student.lastname;
    popup.querySelector("[data-field=nickname]").textContent = "nickname: " + student.nickname;


    checkNames();
    //shows gender hoouse, bloood status, image
    popup.querySelector("[data-field=gender]").textContent = "Gender: " + student.gender;
    popup.querySelector("[data-field=house]").textContent = "House: " + student.house;
    popup.querySelector("[data-field=blood]").textContent = "Blood: " + student.blood;
    popup.querySelector(".image").src = student.image;


    //add styles to the article according to student house
    addStyles(student.house, detailArticle);
    popup.querySelector("#crest").src = `crests/${student.house}.png`;


    //adds click eventlistener to the close button (this is an anonymous closured function)
    document.querySelector("#luk").addEventListener("click", closePopup);
    //adds click eventlistener for expelling student.
    
    document.querySelector("[data-action=expell]").addEventListener("click", expellStudent);

   

    //expelling a student. creates a new array with the expelled student by slicing from allstudents
    function expellStudent() {
       
        
        document.querySelector("[data-action=expell]").removeEventListener("click", expellStudent);

        //makes sure i cannot be expelled (cuz im awesome)
        if(student.awesome){
            alert("⛔️ STUDENT IS AWESOME! CANNOT EXPELL ⛔️")
            //hides expell button after click
        document.querySelector("[data-action=expell]").classList.add("hidden");
        document.querySelector("#awesome").classList.remove("hidden");
    
     student.expelled="false";
        


        }else if(!student.awesome){
      
        //push the student to the expelled array using splice and indexof, also sets expelled to true.
        const indexOf = allStudents.indexOf(student);
        const expelledstudent = allStudents.splice(indexOf, 1)[0];
        expelledstudent.expelled = "true";
        expelledStudents.push(expelledstudent);
        
        //removes the expell button, and replaces with expell mark
        document.querySelector("[data-action=expell]").classList.add("hidden");
        document.querySelector("#mark").classList.remove("hidden");
        
        
        
        
        

        buildList();
        counter();
    }
    }


    // if statements for students that have no middlename,nickname or lastname
    //sets those fields to none display as to not leave empty spaces
    // also sets correct fullnames 
    function checkNames() {
        if (!student.middlename) {
            popup.querySelector("[data-field=middlename]").classList.add("hidden");
            popup.querySelector("[data-field=fullname]").textContent = `${student.firstname} ${student.lastname}`;
        }
        if (!student.nickname) {
            popup.querySelector("[data-field=nickname]").classList.add("hidden");
        }
        if (!student.lastname) {
            popup.querySelector("[data-field=lastname]").classList.add("hidden");
            popup.querySelector("[data-field=fullname]").textContent = student.firstname;
        }
    }

    // reset display optios to show all the fields again
    function resetDisplay() {
        popup.style.display = "block";
        popup.querySelector("[data-field=middlename]").classList.remove("hidden");
        popup.querySelector("[data-field=lastname]").classList.remove("hidden");
        popup.querySelector("[data-field=nickname]").classList.remove("hidden");
        document.querySelector("#awesome").classList.add("hidden");

        //hides button, shows expellmark when student is expelled otherwise makes sure the expell button is visible when not expelled
        if(student.expelled == "true"){
            document.querySelector("[data-action=expell]").classList.add("hidden");
        }else{ document.querySelector("[data-action=expell]").classList.remove("hidden");
        document.querySelector("#mark").classList.add("hidden");
      

    }

       
    }

}

//closing the popup
function closePopup() {
    document.querySelector("#popup").style.display = "none"
}




function counter() {



    const totalStudents = allStudents.length;
    const totalExpelled = expelledStudents.length;



    function hufflepuffStudent() {
        let counter = 0;
        for (let i = 0; i < totalStudents; i++) {
            if (allStudents[i].house === 'Hufflepuff') counter++;
        }
      
        return counter;
    }

    function ravenclawStudent() {
        let counter = 0;
        for (let i = 0; i < totalStudents; i++) {
            if (allStudents[i].house === 'Ravenclaw') counter++;
        }
       
        return counter;
    }

    function gryffindorStudent() {
        let counter = 0;
        for (let i = 0; i < totalStudents; i++) {
            if (allStudents[i].house === 'Gryffindor') counter++;
        }
    
        return counter;
    }

    function slytherinStudent() {
        let counter = 0;
        for (let i = 0; i < totalStudents; i++) {
            if (allStudents[i].house === 'Slytherin') counter++;
        }
   
        return counter;
    }

    //calls counter for students
    displayCount(totalStudents, hufflepuffStudent(), ravenclawStudent(), gryffindorStudent(), slytherinStudent(), totalExpelled);

}

function displayCount(total, huff, raven, gryf, slyth, expelled) {
    document.querySelector(".total").textContent = `Total admitted: ${total}`;
    document.querySelector(".hpStudents").textContent = `Hufflepuff: ${huff}`;
    document.querySelector(".rcStudents").textContent = `Ravenclaw: ${raven}`;
    document.querySelector(".gdStudents").textContent = `Gryffindor: ${gryf}`;
    document.querySelector(".srStudents").textContent = `Slytherin: ${slyth}`;
    document.querySelector(".expelled").textContent = `Expelled: ${expelled}`;
}

function hackTheSystem(){

    if(settings.hacked){
        console.log("ThE SYsTEM iS AlrEady HaCkeD");
    }else{
        //sets settings.hacked to true
        settings.hacked = true;
        console.log(settings.hacked);
        //alerts the user taht the sytem is hacked
        alert("ThE SYsTeM is HAcKd!!!");

        //pushes the object with my info to the student array
        const me = makeMeAWitch();
        allStudents.push(me);
        buildList();

       

    }


 

}
//create a student object with my info
function makeMeAWitch(){
    const me = Object.create(allStudents);
    me.firstname = "Mathilde";
    me.lastname = "Laursen";
    me.middlename = "Emilie";
    me.house  = "Hufflepuff";
    me.gender = "Girl";
    me.image = "images/me.jpg";
    me.blood = "Muggle";
    me.expelled = false;
    me.awesome = true;

return me;

}

console.log(settings.hacked);