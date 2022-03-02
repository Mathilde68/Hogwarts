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
    image: "default image"
}
    ;

const allStudents = [];


const settings = {
    filterBy: "*",
    sortBy: "firstname",
    sortDir: "az"
}



function start() {
    console.log("started");
    //adds eventlistener to button
    registerButtons();

    //load my json
    loadJSON();


}

function registerButtons() {
    document.querySelectorAll("[data-action='filter']")
        .forEach(button => button.addEventListener("click", selectFilter));


    document.querySelectorAll("[data-action='sort']")
        .forEach(button => button.addEventListener("click", selectSort));



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
    addBlood(jsonDataB);
}



function prepareObjects(jsonData, jsonDataB) {

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

    displayList(allStudents);
    counter(allStudents);


}


function addBlood(bloodTypes) {
    const pureblood = bloodTypes.pure;
    const halfblood = bloodTypes.half;

    allStudents.forEach((student) => {
        pureblood.forEach((pure) => {
            if (student.lastname === pure) {
                student.blood = "pure";
            } else
                halfblood.forEach((half) => {
                    if (student.lastname === half) {
                        student.blood = "half";
                    }
                });
        });

        if (!student.blood) {
            student.blood = "muggle";
        }
        console.log(student);
    });
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
        filteredList = allStudents.filter(isHufflepuff);
    } else if (settings.filterBy === "Gryffindor") {
        filteredList = allStudents.filter(isGryffindor);
    } else if (settings.filterBy === "Ravenclaw") {
        filteredList = allStudents.filter(isRavenclaw);
    } else if (settings.filterBy === "Slytherin") {
        filteredList = allStudents.filter(isSlytherin);
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
    
    displayList(sortedList);
}


function displayList(students) {
    
    
    // clear the list
    document.querySelector("#list").innerHTML = "";
    // build a new list
    students.forEach(displayStudent);
    
}



function displayStudent(student) {
    // create clone
    const clone = document.querySelector("template#studentTemplate").content.cloneNode(true);
    const article = clone.querySelector("#student");
    
    // set clone data
    
    //fullname image and house.
    clone.querySelector("[data-field=fullname]").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
    clone.querySelector(".image").src = student.image;
    
    // for students that have no middlename, or lastname,sets correct fullnames 
    if (!student.middlename) {
        clone.querySelector("[data-field=fullname]").textContent = `${student.firstname} ${student.lastname}`;
    }
    if (!student.lastname) {
        clone.querySelector("[data-field=fullname]").textContent = student.firstname;
    }
    
    clone.querySelector("[data-field=house]").textContent = student.house;

    //calls adds style, to article and according to studnet house
    //addStyles(student.house, article);
    //adds click eventlistener that calls the function showDetails for that student
    article.addEventListener("click", () => showDetails(student));
    
    
    // append clone to list
    document.querySelector("#list").appendChild(clone);
    
    
}

function addStyles(studenthouse, dest) {
    dest.className = "";
    dest.classList.add(studenthouse);
}

function showDetails(student) {
    let popup = document.querySelector("#popup");
    const detailArticle = popup.querySelector("#studentDetail");


    resetDisplay();



    //set display style to block to make visible
    popup.style.display = "block";

    //shows fullname, firstname, lastnames, nicknames and middle names.
    popup.querySelector("[data-field=fullname]").textContent = `${student.firstname} ${student.middlename} ${student.lastname}`;
    popup.querySelector("[data-field=firstname]").textContent = `Firstname: ${student.firstname}`;
    popup.querySelector("[data-field=middlename]").textContent = `Middlename: ${student.middlename}`;
    popup.querySelector("[data-field=lastname]").textContent = "lastname: " + student.lastname;
    popup.querySelector("[data-field=nickname]").textContent = "nickname: " + student.nickname;
    // if statements for students that have no middlename,nickname or lastname
    //sets those fields to none display as to not leave empty spaces
    // also sets correct fullnames 
    checkNames();
    function checkNames(){
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
    popup.querySelector(".image").src = student.image;

    //shows gender hosue and bloood status
    popup.querySelector("[data-field=gender]").textContent = "Gender: " + student.gender;
    popup.querySelector("[data-field=house]").textContent = "House: " + student.house;
    popup.querySelector("[data-field=blood]").textContent = "Blood: " + student.blood;
    //add styles to the article according to student house
    addStyles(student.house, detailArticle);
    popup.querySelector("#crest").src = `crests/${student.house}.png`;


    //adds click eventlistener to the close button (this is an anonymous closured function)
    document.querySelector("#luk").addEventListener("click", () => popup.style.display = "none");

    function resetDisplay() {
        popup.querySelector("[data-field=middlename]").style.display = "block";
        popup.querySelector("[data-field=lastname]").style.display = "block";
        popup.querySelector("[data-field=nickname]").style.display = "block";
    }


}

function counter(student) {

    //calls counter for students
    displayCount(totalStudents(), hufflepuffStudent(), ravenclawStudent(), gryffindorStudent(), slytherinStudent());

    function totalStudents() {
        return student.length;
    }

    function hufflepuffStudent() {
        let counter = 0;
        for (let i = 0; i < student.length; i++) {
            if (student[i].house === 'Hufflepuff') counter++;
        }
        console.log(counter);
        return counter;
    }

    function ravenclawStudent() {
        let counter = 0;
        for (let i = 0; i < student.length; i++) {
            if (student[i].house === 'Ravenclaw') counter++;
        }
        console.log(counter);
        return counter;
    }

    function gryffindorStudent() {
        let counter = 0;
        for (let i = 0; i < student.length; i++) {
            if (student[i].house === 'Gryffindor') counter++;
        }
        console.log(counter);
        return counter;
    }

    function slytherinStudent() {
        let counter = 0;
        for (let i = 0; i < student.length; i++) {
            if (student[i].house === 'Slytherin') counter++;
        }
        console.log(counter);
        return counter;
    }

}

function displayCount(total, huff, raven, gryf, slyth, expelled) {
    document.querySelector(".total").textContent += total;
    document.querySelector(".hpStudents").textContent += huff;
    document.querySelector(".rcStudents").textContent += raven;
    document.querySelector(".gdStudents").textContent += gryf;
    document.querySelector(".srStudents").textContent += slyth;
}


