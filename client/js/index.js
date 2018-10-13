console.log("app connected with controller");

var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope, $http) {
    $scope.name = "John Doe";
    $scope.viewInput = false;
    $scope.Books = [
        { title: "Pokemon", author: "Duong Nguyen", pages: 22 }
    ];

    //call api to get book
    $http({
        method: 'GET',
        url: '/book'
    }).then(function successCallback(response) {
        console.log("Get all books");
        $scope.Books = response.data;
    }, function errorCallback(response) {
        console.log("something wrong...")
    });

    //class to create a new book
    $scope.Book = function (title, author, pages) {
        this.title = title;
        this.author = author;
        this.pages = pages;
    }

    //fucntion to add a book
    $scope.addBook = function (title, author, pages) {
        if (title == "" || author == "" || pages == "" ||
            title == null || author == null || pages == null
        ) {
            alert("Please enter values!")
        } else {
            var data = new $scope.Book(title, author, pages);
            //call api to get book
            $http({
                method: 'POST',
                url: '/book',
                data: data
            }).then(function successCallback(response) {
                $scope.Books.push(data);
                $scope.title = "";
                $scope.author = "";
                $scope.pages = "";
                console.log("Created");
            }, function errorCallback(response) {
                console.log("something wrong...")
            });


        }

    }

    //function to view all books
    $scope.viewBook = function () {
        $scope.Books.forEach(function (item, index) {
            console.log("Title: " + item.title + ", author: " + item.author + ", pages: " + item.pages)
        })
    }

    //function to delete a book
    $scope.deleteBook = function (index) {
        // $scope.Books.splice(index, 1);
        var url = "/book/" + index;
        $http({
            method: 'DELETE',
            url: url
        }).then(function successCallback(response) {
            $scope.Books.splice(index, 1);
            console.log("Deleted");
        }, function errorCallback(response) {
            console.log("something wrong...")
        });
    }

    //function to update book $index
    $scope.updateBook = function (index) {
        console.log("Update book: " + index);
        var url = "/book/" + index;
        var data = new $scope.Book($scope.Books[index].title, $scope.Books[index].author, $scope.Books[index].pages);
        $http({
            method: 'PUT',
            url: url,
            data: data
        }).then(function successCallback(response) {
            //$scope.Books.splice(index, 1);
            console.log("Updated");
        }, function errorCallback(response) {
            console.log("something wrong...")
        });
    }
});