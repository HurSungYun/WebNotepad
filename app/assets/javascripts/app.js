var myApp = angular.module('webnotepad', []);


myApp.controller('notecontroller',function($scope, $http, $rootScope) {
// initialize variables
        $scope.formReadonly = $scope.curr_eid == null ? false : true;
        $scope.checkList = [];
        $scope.updatedAt = null;
        $scope.alertMsg = "";
	$scope.notes = [];
        $scope.notesNumber = 0;
        $scope.labels = [];
        $scope.curr_eid = null;
        $scope.subject = "";
        $scope.contetn = "";
        $scope.editMode = false;
        $scope.showingNotes = [];
        $scope.selectedLabel = 0;
        $scope.selectedLabelName = "All";
        $scope.changingLabelName = "";
        $scope.newlabelname = "";
        $http.get('/notes/read').then(function(response) {
          $scope.notes = response.data;
          $scope.showingNotes = $scope.notes;
          $scope.notesNumber = $scope.notes.length;
          $scope.doParameter();
        });
        $http.get('/labels/read').then(function(response) {
          $scope.labels = response.data;
          $scope.doParameter();
        });
        $scope.doParameter = function() {
          if($scope.params.note != null && $scope.params.note != 0){
            var i;
            for(i = 0; i < $scope.notes.length; i++) {
              if($scope.params.note == $scope.notes[i].eid){
                $scope.showNote($scope.notes[i]);
                break;
              }
            }
          }
          if($scope.params.label != null && $scope.params.label != 0){
            var i;
            for(i = 0; i < $scope.labels.length; i++) {
              if($scope.params.label == $scope.labels[i].eid){
                $scope.selectedLabel = $scope.labels[i].eid;
                $scope.selectedLabelName = $scope.labels[i].name;
                $scope.getNotesFromLabel($scope.labels[i].eid);
                break;
              }
            }
          }
        };
	$scope.initParameter = function(note, label) {
		$scope.params = { note : note, label : label };
        };
//From here, change read/edit mode
        $scope.formChangeEdit = function() {
           $scope.formReadonly = false;
        };
        $scope.formChangeRead = function() {
           $scope.formReadonly = true;
        };
//From here, history part
        $scope.pushHistory =  function(pLabel,pNote) { 
          var tLabel = { eid : 0 };
          var tNote = {eid : 0 };
          if(pLabel != null) {
            tLabel = pLabel;
            if($scope.curr_eid != null) {
              tNote.eid = $scope.curr_eid;
            }
          }
          if(pNote != null) {
            tNote = pNote;
            if($scope.selectedLabel != null) {
              tLabel.eid = $scope.selectedLabel;
            }
          }
          var state = { selectedLabel: tLabel.eid },
              title = "Page title",
              path  = "/page/index?label=" + tLabel.eid + "&note=" + tNote.eid;
          history.pushState(state, title, path);
        };
        
//From here, handle checklist
        $scope.checkNote = function(pNote) {
          var i, flag = false;
          for(i = 0; i < $scope.checkList.length; i++) {
             if($scope.checkList[i] == pNote.eid) {
               flag = true;
               break;
             }
          }
          if(flag == true) {
            $scope.uncheckNote(i);
          } else {
            $scope.checkList.push(pNote.eid);
          }
        };
        $scope.uncheckNote = function(idx) { 
            $scope.checkList.splice(idx,1);
        };
        $scope.uncheckAll = function() {
            angular.forEach($scope.showingNotes, function (pNote) {
              pNote.selected = false;
            });
            $scope.checkList = [];
        };
//From here, handle Labels
        $scope.makeShowingNotesEmpty = function() {
           $scope.showingNotes = [];
        };
        $scope.getNotesFromLabel = function(label_eid) {
           var i, j, cur_label;
           $scope.makeShowingNotesEmpty();
           for(i = 0; i < $scope.labels.length; i++) {
             if($scope.labels[i].eid == label_eid){
               cur_label = i;
               break;
             }
           }
           for(i = 0; i < $scope.labels[cur_label].notes.length; i++) {
              for(j = 0; j < $scope.notes.length; j++) {
                 if($scope.labels[cur_label].notes[i].eid == $scope.notes[j].eid) {
                    $scope.showingNotes.push($scope.notes[j]);
                    break;
                 }
              }
           }
        };
        $scope.changeLabel = function(pLabel) {
           $scope.uncheckAll();
           $scope.selectedLabel = pLabel.eid;
           $scope.selectedLabelName = pLabel.name;
           $scope.getNotesFromLabel(pLabel.eid);
           $scope.alertMsg = "";
           $scope.pushHistory(pLabel,null);
        };
        $scope.initLabel = function() {
           $scope.uncheckAll();
           $scope.selectedLabel = 0;
           $scope.selectedLabelName = "All";
           $scope.newlabelname = "";
           $scope.showingNotes = $scope.notes;
           $scope.alertMsg = "";
           $scope.pushHistory({ eid : 0 }, null);
        };
        $scope.deleteLabel = function() {
            var dataObj = {
             id : $scope.selectedLabel
          }
          var res = $http.post('/labels/delete',dataObj);
          res.success(function(data, status, headers, config) {
            var i;
               for(i = 0; i< $scope.labels.length; i++){
                  if ( $scope.labels[i].eid == data.eid ){
                    $scope.labels.splice(i,1);
                    $scope.initLabel();
                    break;
                 }
              }
            $scope.alertMsg = "label is deleted successfully";
          });
          res.error(function(data, status, headers, config) {
          });
        };
        $scope.newLabel = function() {
          var dataObj = {
             name : $scope.newlabelname
          }
          var res = $http.post('/labels/create',dataObj);
        
          res.success(function(data, status, headers, config) {
            if(data.eid != -1){
              $scope.labels.push(data);
              $scope.changeLabel(data);
              $scope.newlabelname = "";
              $scope.alertMsg = "label is created successfully";
            }else{
              $scope.alertMsg = "length of label should be 1~15";
            }
          });
          res.error(function(data, status, headers, config) {
          }); 
       };
       $scope.editLabel = function() {
         var dataObj = {
           id : $scope.selectedLabel,
           name : $scope.changingLabelName
         };
         var res = $http.post('/labels/update', dataObj);
         res.success(function(data, status, headers, config) {
           if(data.eid != -1){
             var i;
             for (i = 0; i < $scope.labels.length; i++){
               if ($scope.labels[i].eid == data.eid) {
                 $scope.labels[i].name = data.name;
                 $scope.selectedLabelName = data.name;
                 $scope.alertMsg = "label name is changed successfully";
                 break;
               }
             }
             $scope.changingLabelName = "";
           }else{
             $scope.alertMsg = "length of label should be 1~15";
           }
         });
         res.error(function(data, status, headers, config) {
          });
       }; 
       $scope.tagLabel = function(pLabel) {
          var dataObj = {
            list : $scope.checkList,
            id : pLabel.eid
          }
          $scope.uncheckAll();
          var res = $http.post('/labels/tagLabel', dataObj);
          res.success(function(data, status, headers, config) {
            var i;
            for (i = 0; i < $scope.labels.length; i++){
              if ($scope.labels[i].eid == data.eid) {
                $scope.labels[i].item = data.item;
                $scope.labels[i].notes = data.notes;
                $scope.getNotesFromLabel($scope.labels[i].eid);
                $scope.changeLabel($scope.labels[i]);
                $scope.checkList = [];
                break;
              } 
            }
          });
          res.error(function(data, status, headers, config) {
          });
       };
       $scope.untagLabel = function() {
         var dataObj = {
           list : $scope.checkList,
           id : $scope.selectedLabel
         }
         $scope.uncheckAll();
         var res = $http.post('/labels/untagLabel', dataObj);
         res.success(function(data, status, headers, config) {
            var i, j;
            for (i = 0; i < $scope.labels.length; i++){
              if ($scope.labels[i].eid == data.eid) {
                $scope.labels[i].item = data.item;
                //delete notes id from list
                $scope.labels[i].notes = data.notes;
                $scope.getNotesFromLabel($scope.labels[i].eid);
                $scope.checkList = [];
                break;
              }
            }
         });
       };
       $scope.deleteNoteList = function() {
         for(i = 0; i < $scope.checkList.length; i++){
           for(j = 0; j < $scope.notes.length; j++){
             if($scope.checkList[i] == $scope.notes[j].eid){
               $scope.deleteNote($scope.notes[j]);
               console.log("RUN");
               break;
             }
           }
         }
         $scope.uncheckAll();
       };
// From here, handle Notes
        $scope.changeCreateMode = function() {
          $scope.subject = "";
          $scope.content = "";
          $scope.updatedAt = null;
          $scope.editMode = false;
          $scope.curr_eid = null;
          $scope.alertMsg = "";
          $scope.formChangeEdit();
        };
        $scope.newNote = function() {
          var dataObj = {
				subject : $scope.subject,
				content : $scope.content
		}; 
          var res = $http.post('/notes/create', dataObj);
		res.success(function(data, status, headers, config) {
                        if( data.eid != -1) {
			  $scope.notes.push(data);
                          $scope.editMode = true;
                          $scope.curr_eid = data.eid;
                          $scope.updatedAt = data.updatedAt;
                          $scope.notesNumber = $scope.notesNumber + 1;
                          $scope.alertMsg = "note is created successfully";
                          $scope.formChangeRead();
                        }else{
                          $scope.alertMsg = "length of subject should be 1~45";
                        }
		});
		res.error(function(data, status, headers, config) {
		});
        };
        $scope.showNote = function(pNote) {
          $scope.subject = pNote.subject;
          $scope.content = pNote.content;
          $scope.updatedAt = pNote.updatedAt;
          $scope.curr_eid = pNote.eid;
          $scope.editMode = true;
          $scope.alertMsg = "";
          $scope.formChangeRead();
          $scope.pushHistory(null,pNote);
        };
        $scope.editNote = function() {
          var dataObj = {
              id : $scope.curr_eid,
              subject : $scope.subject,
              content : $scope.content,
          };
          var res = $http.post('/notes/update',dataObj);
               res.success(function(data, status, headers, config) {
                  if( data.eid != -1){
                    var i;
                    for(i=0; i< $scope.notes.length; i++){
                       if ( $scope.notes[i].eid == data.eid ){
                         $scope.notes[i].subject = data.subject;
                         $scope.notes[i].content = data.content;
                         $scope.subject = data.subject;
                         $scope.content = data.content;
                         $scope.updatedAt = data.updatedAt;
                       
                         break;
                       }
                     }
                     $scope.alertMsg = "note is updated succesfully";
                     $scope.formChangeRead();
                   }else{
                     $scope.alertMsg = "length of subject should be 1~45";
                   }
               });
               res.error(function(data, status, headers, config) {
               });
        };
        $scope.deleteNote = function(pNote) {
          if(pNote!=null){
            var dataObj = {
              id : pNote.eid
            };
          }else{
            var dataObj = {
              id : $scope.curr_eid
            };
          }
          var res = $http.post('/notes/delete',dataObj);
          
          res.success(function(data, status, headers, config) {
             var i, j, pLabel;
             for(i = 0; i < $scope.notes.length; i++){            // update all
                if( $scope.notes[i].eid == data.eid ){
                  $scope.notes.splice(i,1);
                  $scope.changeCreateMode();
                  $scope.notesNumber = $scope.notesNumber - 1;
                  break;
               }
             }
             
             for(i = 0; i < $scope.labels.length; i++){          //update labels 
                for(j = 0; j < $scope.labels[i].notes.length; j++){
                  if($scope.labels[i].notes[j].eid == data.eid){
                    if($scope.labels[i].eid == $scope.selectedLabel){
                      pLabel = $scope.labels[i];
                    }
                    $scope.labels[i].notes.splice(j,1);
                    $scope.labels[i].item = $scope.labels[i].item - 1;
                  }
                }
             }
             
             if(pLabel != null)
               $scope.changeLabel(pLabel);
             $scope.checkList = [];
             $scope.curr_eid = null;
             $scope.alertMsg = "note is deleted succesfully";
             $scope.formChangeEdit();
             $scope.pushHistory(pLabel,{ eid: 0});
          });
          res.error(function(data, status, headers, config) {
          });
        };
 
});
