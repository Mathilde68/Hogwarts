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
    expelled: "false"
}
    ;

const allStudents = [];
const expelledStudents = [];



const settings = {
    filterBy: "*",
    sortBy: "",
    sortDir: "az"
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
        let middleName;
        let lastName;
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
                middleName = undefined;
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


//makes sure my filter and sort works together before displaying list
function buildList() {

    const currentList = filterList(allStudents);
    const sortedList = sortList(currentList);

    const expelledList = filterList(expelledStudents);
    const sortedExpelledList = sortList(expelledList);


    displayList(sortedList, sortedExpelledList);
}


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
    if (student.expelled == "true") {
        expelledData(student);
    } else {
        studentData();

    }

    function studentData() {
        // set clone data
        //fullname image and house.
        clone.querySelector("[data-field=fullname]").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
        clone.querySelector(".image").src = student.image;
        clone.querySelector("[data-field=blood]").textContent = "studentblood: " + student.blood;

        // for students that have no middlename, or lastname,sets correct fullnames 
        if (!student.middlename) {
            clone.querySelector("[data-field=fullname]").textContent = `${student.firstname} ${student.lastname}`;
        }
        if (!student.lastname) {
            clone.querySelector("[data-field=fullname]").textContent = student.firstname;
        }

        clone.querySelector("[data-field=house]").textContent = student.house;



        //appends clone to the list
        document.querySelector("#list").appendChild(clone);
    }

    function expelledData(student) {

        // set clone data
        //fullname image and house.
        clone.querySelector("[data-field=fullname]").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
        clone.querySelector(".image").src = student.image;
        clone.querySelector("[data-field=blood]").textContent = "studentblood: " + student.blood;

        // for students that have no middlename, or lastname,sets correct fullnames 
        if (!student.middlename) {
            clone.querySelector("[data-field=fullname]").textContent = `${student.firstname} ${student.lastname}`;
        }
        if (!student.lastname) {
            clone.querySelector("[data-field=fullname]").textContent = student.firstname;
        }

        clone.querySelector("[data-field=house]").textContent = student.house;



        //appends clone to the expelled list
        document.querySelector("#expelledlist").appendChild(clone);

    }

    studentActions(student);


    function studentActions() {

        //adds click eventlistener that calls the function showDetails for that student (the pop up view)
        article.querySelector(".image").addEventListener("click", () => showDetails(student));


    }


}



function addStyles(studenthouse, dest) {
    dest.className = "";
    dest.classList.add(studenthouse);
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

        const indexOf = allStudents.indexOf(student);
        const expelledstudent = allStudents.splice(indexOf, 1)[0];
        expelledstudent.expelled = "true";
        expelledStudents.push(expelledstudent);
        buildList();
        counter();
        console.log(expelledStudents);
        console.log(expelledstudent);
        console.log(allStudents);
    }


    // if statements for students that have no middlename,nickname or lastname
    //sets those fields to none display as to not leave empty spaces
    // also sets correct fullnames 
    function checkNames() {
        if (!student.middlename) {
            popup.querySelector("[data-field=middlename]").style.display = "none";
            popup.querySelector("[data-field=fullname]").textContent = `${student.firstname} ${student.lastname}`;
        }
        if (!student.nickname) {
            popup.querySelector("[data-field=nickname]").style.display = "none";
        }
        if (!student.lastname) {
            popup.querySelector("[data-field=lastname]").style.display = "none";
            popup.querySelector("[data-field=fullname]").textContent = student.firstname;
        }
    }

    // reset display optios to show all the fields again
    function resetDisplay() {
        popup.style.display = "block";
        popup.querySelector("[data-field=middlename]").style.display = "block";
        popup.querySelector("[data-field=lastname]").style.display = "block";
        popup.querySelector("[data-field=nickname]").style.display = "block";
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
        console.log(counter);
        return counter;
    }

    function ravenclawStudent() {
        let counter = 0;
        for (let i = 0; i < totalStudents; i++) {
            if (allStudents[i].house === 'Ravenclaw') counter++;
        }
        console.log(counter);
        return counter;
    }

    function gryffindorStudent() {
        let counter = 0;
        for (let i = 0; i < totalStudents; i++) {
            if (allStudents[i].house === 'Gryffindor') counter++;
        }
        console.log(counter);
        return counter;
    }

    function slytherinStudent() {
        let counter = 0;
        for (let i = 0; i < totalStudents; i++) {
            if (allStudents[i].house === 'Slytherin') counter++;
        }
        console.log(counter);
        return counter;
    } 

     //calls counter for students
     displayCount(totalStudents, hufflepuffStudent(), ravenclawStudent(), gryffindorStudent(), slytherinStudent(),totalExpelled);

}

function displayCount(total, huff, raven, gryf, slyth, expelled) {
    document.querySelector(".total").textContent =`Total: ${total}`;
    document.querySelector(".hpStudents").textContent = `Hufflepuff: ${huff}`;
    document.querySelector(".rcStudents").textContent = `Ravenclaw: ${raven}`;
    document.querySelector(".gdStudents").textContent = `Gryffindor ${gryf}`;
    document.querySelector(".srStudents").textContent = `Slytherin: ${slyth}`;
    document.querySelector(".expelled").textContent = `Expelled: ${expelled}`;
}

