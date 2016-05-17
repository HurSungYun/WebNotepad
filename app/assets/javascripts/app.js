var myApp = angular.module('webnotepad', []);


myApp.controller('notecontroller',function($scope, $http, $rootScope, $window) {

// initialize variables
        $scope.formReadonly = $scope.curNoteId == null ? false : true;  //This checks the note view is read mode or edit mode
        $scope.checkList = [];      // This variable stores id list of checked note
        $scope.updatedAt = "";    // This variable stores and showing updatedAt value of current note
        $scope.alertMsg = "";       // This is string that shows uppermost bar. This is use for noticing something to user
	$scope.notes = [];          // Get all notes list from server and store it
        $scope.notesNumber = 0;     // number of notes
        $scope.labels = [];         // store information of label
        $scope.curNoteId = 0;     // id of current showing note 
        $scope.subject = "";        // subject of ../
        $scope.content = "";        // content of ...
        $scope.editMode = false;    // signal bit for telling note view is editmode or createmode
        $scope.showingNotes = [];   // note that showing at note list view
        $scope.selectedLabel = 0;   // id of selected label
        $scope.selectedLabelName = "All";  // name of selected label
        $scope.changingLabelName = "";  // store name for change label name (temporary)
        $scope.newLabelName = ""; // store name for new label name (temporary) 
        $scope.noteSearch = "";
        $scope.somethingFiltered = true;

        function findLabelIndexById(label_id){
          var i;
          for(i = 0; i < $scope.labels.length; i++) {
            if($scope.labels[i].eid == label_id) {
              break;
            }
          }
          return i;
        };

        function findNoteIndexById(note_id){
          var i;
          for(i = 0; i < $scope.notes.length; i++) {
            if($scope.notes[i].eid == note_id) {
              break;
            }
          }
          return i;
        };

        function setShowNote(pSubject, pContent, pUpdatedAt, pNoteId){
          if(pSubject != null) $scope.subject = pSubject;
          if(pContent != null) $scope.content = pContent;
          if(pUpdatedAt != null) $scope.updatedAt = pUpdatedAt;
          if(pNoteId != null) $scope.curNoteId = pNoteId;
        };

        function setShowLabel(pId,pName){
          if(pId != null) $scope.selectedLabel = pId;
          if(pName != null) $scope.selectedLabelName = pName;
        };

// Get data from server

        $http.get('/notes/read').then(function(response) { // Get the note data from server at first loading page
          $scope.notes = response.data;
          $scope.showingNotes = $scope.notes;
          $scope.notesNumber = $scope.notes.length;
          $scope.doParameter();
        });

        $http.get('/labels/read').then(function(response) { // Get the label data from server at first loading page
          $scope.labels = response.data;
          $scope.doParameter();
        });

        $scope.initFlag = false;

        $scope.doParameter = function() {                     // Due to async, it is called twice 
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
                setShowLabel($scope.labels[i].eid, $scope.labels[i].name);
                $scope.getNotesFromLabel($scope.labels[i].eid);
                break;
              }
            }
          }
          if($scope.initFlag == false) $scope.initFlag = true;
          else $scope.saveCurrentState();
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

        $scope.searchingFilter = function() {
          var i, flag = false;
          for (i=0;i<$scope.showingNotes.length;i++) {
            if($scope.showingNotes[i].content != null && $scope.showingNotes[i].content.indexOf($scope.noteSearch) > -1) {
              flag = true;
              break;
          }  
            if($scope.showingNotes[i].subject.indexOf($scope.noteSearch) > -1){  
              flag = true;
              break;
          }
        }
          if(flag) $scope.somethingFiltered = true;
          else $scope.somethingFiltered = false;
        };

        state_pointer = -1;
        selectedLabel_save = [];
        selectedLabelName_save = [];
        curNoteId_save = [];
        subject_save = [];
        content_save = [];
        updatedAt_save = [];
        editMode_save = [];

//From here, history part

        $scope.saveCurrentState = function(){
          selectedLabel_save.push($scope.selectedLabel);
          selectedLabelName_save.push($scope.selectedLabelName);
          curNoteId_save.push($scope.curNoteId);
          subject_save.push($scope.subject);
          content_save.push($scope.content);
          updatedAt_save.push($scope.updatedAt);
          editMode_save.push($scope.editMode);
          state_pointer = state_pointer + 1;
        };

        $scope.getCurrentState = function(){
          //TODO: handling go backwards too far
          if(state_pointer != 0) 
            state_pointer = state_pointer - 1;

          $scope.uncheckAll();
          $scope.selectedLabel = selectedLabel_save[state_pointer];
          $scope.selectedLabelName = selectedLabelName_save[state_pointer];
          $scope.curNoteId = curNoteId_save[state_pointer];
          $scope.subject = subject_save[state_pointer];
          $scope.content = content_save[state_pointer];
          $scope.updatedAt = updatedAt_save[state_pointer];
          $scope.editMode = editMode_save[state_pointer];
          if(!$scope.editMode) $scope.formChangeEdit();
          else $scope.formChangeRead();
          if($scope.selectedLabel != 0) $scope.getNotesFromLabel($scope.selectedLabel);
          else {
            setShowLabel(0,"All");
            $scope.showingNotes = $scope.notes;
          }
          $scope.$apply();
        };

        $window.onpopstate = function(event) {
          $scope.getCurrentState();
        };

        $scope.pushHistory =  function(pLabel,pNote) {

          $scope.saveCurrentState();

          var tLabel = { eid : 0 };
          var tNote = {eid : 0 };
          if(pLabel != null) {
            tLabel = pLabel;
            if($scope.curNoteId != null) {
              tNote.eid = $scope.curNoteId;
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
           var i, j, cur_label, note_idx;
           $scope.makeShowingNotesEmpty();

           cur_label = findLabelIndexById(label_eid);

           for(i = 0; i < $scope.labels[cur_label].notes.length; i++) {
              note_idx = findNoteIndexById($scope.labels[cur_label].notes[i].eid)
              $scope.showingNotes.push($scope.notes[note_idx]);
           }
        };
        $scope.changeLabel = function(pLabel) {
           $scope.uncheckAll();
           setShowLabel(pLabel.eid, pLabel.name);
           $scope.getNotesFromLabel(pLabel.eid);
           $scope.alertMsg = "";
           $scope.pushHistory(pLabel,null);
        };
        $scope.initLabel = function() {
           $scope.uncheckAll();
           setShowLabel(0,"All");
           $scope.newLabelName = "";
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
            var label_idx;
            label_idx = findLabelIndexById(data.eid);
            $scope.labels.splice(label_idx,1);
            $scope.initLabel();
            $scope.alertMsg = "label is deleted successfully";
          });
          res.error(function(data, status, headers, config) {
          });
        };
        $scope.newLabel = function() {
          var dataObj = {
             name : $scope.newLabelName
          }

          var res = $http.post('/labels/create',dataObj);
        
          res.success(function(data, status, headers, config) {
            if(data.eid != -1){
              $scope.labels.push(data);
              $scope.changeLabel(data);
              $scope.newLabelName = "";
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
             var label_idx;

             label_idx = findLabelIndexById(data.eid);
             $scope.labels[label_idx].name = data.name;
             setShowLabel(null,data.name);
             $scope.alertMsg = "label name is changed successfully";
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
            var label_idx;
            label_idx = findLabelIndexById(data.eid);
            $scope.labels[label_idx].item = data.item;
            $scope.labels[label_idx].notes = data.notes;
            $scope.getNotesFromLabel($scope.labels[label_idx].eid);
            $scope.changeLabel($scope.labels[label_idx]);
            $scope.checkList = [];
            $scope.alertMsg = "notes are tagged successfully"
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
            var label_id;
            label_idx = findLabelIndexById(data.eid);
            $scope.labels[label_idx].item = data.item;
            $scope.labels[label_idx].notes = data.notes;
            $scope.getNotesFromLabel($scope.labels[label_idx].eid);
            $scope.checkList = [];
            $scope.alertMsg = "notes are untagged successfully"
         });
       };
       $scope.deleteNoteList = function() {
         var note_idx, i;
         for(i = 0; i < $scope.checkList.length; i++){
           note_idx = findNoteIndexById($scope.checkList[i]);
           $scope.deleteNote($scope.notes[note_idx]);
         }
         $scope.alertMsg = "notes lists are deleted successfully"
         $scope.uncheckAll();
       };
// From here, handle Notes
        $scope.changeCreateMode = function() {
          setShowNote("","","",0);
          $scope.editMode = false;
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
              setShowNote(null,null,data.updatedAt,data.eid);
              $scope.notesNumber = $scope.notesNumber + 1;
              $scope.alertMsg = "note is created successfully";
              $scope.formChangeRead();
              $scope.searchingFilter();
              $scope.pushHistory(null,data);
            }else{
              $scope.alertMsg = "length of subject should be 1~45";
            }
	  });
	  res.error(function(data, status, headers, config) {
	  });
        };
        $scope.showNote = function(pNote) {
          setShowNote(pNote.subject, pNote.content, pNote.updatedAt, pNote.eid);
          $scope.editMode = true;
          $scope.alertMsg = "";
          $scope.formChangeRead();
          $scope.pushHistory(null,pNote);
        };
        $scope.editNote = function() {
          var dataObj = {
              id : $scope.curNoteId,
              subject : $scope.subject,
              content : $scope.content,
          };
          var res = $http.post('/notes/update',dataObj);
               res.success(function(data, status, headers, config) {
                  if( data.eid != -1){
                    var i, note_idx;
                    note_idx = findNoteIndexById(data.eid);
                    $scope.notes[note_idx].subject = data.subject;
                    $scope.notes[note_idx].content = data.content;
                    setShowNote(data.subject, data.content, data.updatedAt, null);
                    $scope.alertMsg = "note is updated succesfully";
                    $scope.formChangeRead();
                    $scope.searchingFilter();
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
              id : $scope.curNoteId
            };
          }
          var res = $http.post('/notes/delete',dataObj);
          
          res.success(function(data, status, headers, config) {
             var i, j, pLabel, note_idx;
             note_idx = findNoteIndexById(data.eid);
             $scope.notes.splice(note_idx,1);
             $scope.changeCreateMode();
             $scope.notesNumber = $scope.notesNumber - 1;
             
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
             setShowNote(null,null,null,0);
             $scope.alertMsg = "note is deleted succesfully";
             $scope.formChangeEdit();
             $scope.searchingFilter();
             $scope.pushHistory(pLabel,{ eid: 0});
          });
          res.error(function(data, status, headers, config) {
          });
        }; 
});
