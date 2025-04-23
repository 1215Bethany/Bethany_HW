
new Vue({
    el: '#app',
    data() {
      return {
        users: [],  // 改為空陣列，資料由後端取得
        form: {
          name: '', gender: '', birthday: '', job: '', phone: '', image: ''
        },
        showModal: false,
        editingUser: null,
        currentView: 'card',
        cardPage: 1,
        tablePage: 1,
        pageSize: 6,
        searchKeyword: '',
        defaultImage: '../使用者.jpeg', //預設影像
        modalFromTable: false,
        confirmDelete: false,
        userToDeleteId: null,
        showSuccessModal: false,
        showSuccessModal: false,
        showErrorModal: false,
        imageFile: null, 
        successMessage: '',  
        searchInput: '',
        searchKeyword: '',
        debounceTimer: null,

      };
    },
    computed: {
      filteredUsers() {
        return this.users.filter(user =>
          Object.values(user).some(value =>
            value.toLowerCase?.().includes(this.searchKeyword.toLowerCase())
          )
        );
      },

      paginatedUsersCard() {
        const start = (this.cardPage - 1) * this.pageSize;
        return this.filteredUsers.slice(start, start + this.pageSize);
      },
      paginatedUsersTable() {
        const start = (this.tablePage - 1) * this.pageSize;
        return this.filteredUsers.slice(start, start + this.pageSize);
      }
      
    },

// 串API
methods: {
    openModal() {
      this.editingUser = null;
      this.form = { name: '', gender: '', birthday: '', job: '', phone: '', image: '' };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    saveUser() {
        if (!this.form.name.trim()) {
          this.showErrorModal = true;
          return;
        }
      
        const isEdit = this.editingUser !== null;
        const userId = isEdit ? this.editingUser.id : Date.now();
      
        const submitUserData = (imagePath = this.form.image) => {
          const userData = {
            ...this.form,
            id: userId,
            image: imagePath
          };
      
          if (isEdit) {
            // 更新使用者資訊
            axios.put(`http://localhost:8000/users/${userId}`, userData)
              .then(res => {
                const index = this.users.findIndex(u => u.id === userId);
                if (index !== -1) this.users.splice(index, 1, res.data);
                this.closeModal();
                // this.showSuccessModal = true;
                this.successMessage = this.editingUser ? '修改成功！' : '新增成功！';
                this.showSuccessModal = true;

              })
              .catch(err => console.error("更新失敗", err));
      
          } else {
            // 新增使用者
            axios.post("http://localhost:8000/users", userData)
              .then(res => {
                this.users.push(res.data);
                this.closeModal();
                this.successMessage = this.editingUser ? '修改成功！' : '新增成功！';
                this.showSuccessModal = true;
              })
              .catch(err => console.error("新增失敗", err));
          }
        };
      
        if (this.imageFile) {
          const formData = new FormData();
          formData.append("name", this.form.name);
          formData.append("gender", this.form.gender);
          formData.append("image", this.imageFile);
      
          axios.post("http://localhost:8000/upload-user", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then(res => submitUserData(res.data.image_path))
          .catch(err => console.error("圖片上傳失敗", err));
        } else {
          submitUserData();
        }
      },
    
    editUser(user, fromTable = false) {
      this.editingUser = user;
      this.modalFromTable = fromTable;
      this.form = { ...user };
      this.showModal = true;
    },
    confirmDeleteUser(id) {
      this.userToDeleteId = id;
      this.confirmDelete = true;
    },
    deleteConfirmed() {
        axios.delete(`http://localhost:8000/users/${this.userToDeleteId}`)
          .then(() => {
            this.confirmDelete = false;
            this.userToDeleteId = null;
            location.reload(); // 🔁 重新載入整個頁面
          })
          .catch(error => {
            console.error("刪除失敗：", error);
          });
      },
    cancelDelete() {
      this.confirmDelete = false;
      this.userToDeleteId = null;
    },
      onImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
          this.imageFile = file; // ⬅️ 這是送到後端的原始檔案
          const reader = new FileReader();
          reader.onload = () => {
            this.form.image = reader.result;  // 這只是預覽用（base64），非後端用
          };
          reader.readAsDataURL(file);
        }
      },

    getUserImage(user) {
        if (user.image && user.image.trim() !== '') {
          return `http://localhost:8000${user.image}`;  // 組出完整網址
        } else {
          return this.defaultImage;
        }
      },
      
    closeSuccessModal() {
        this.showSuccessModal = false;
    },
    closeErrorModal() {
        this.showErrorModal = false;
    },
    debouncedSearch() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
          this.searchKeyword = this.searchInput;
        }, 300); // 300 毫秒 debounce
    },     
  },
  
  // 加入 created 生命週期鉤子
  created() {
    axios.get("http://localhost:8000/users")
      .then(response => {
        this.users = response.data;
      })
      .catch(error => {
        console.error("無法取得使用者資料：", error);
      });
  }
  });
  