// Variables globales - SYSTÈME SIMPLIFIÉ
let categories = JSON.parse(localStorage.getItem('categories')) || ['Subhan Allah', 'Elhamdulillah', 'Allahu Ekber'];
let counters = JSON.parse(localStorage.getItem('counters')) || {};
let currentCategory = '';
let currentDate = new Date().toDateString();
let visualOffset = 0; // Décalage visuel pour l'affichage

// Fonction pour afficher une confirmation personnalisée
function showCustomConfirm(title, message, onYes, onNo = null) {
    // Supprimer toute confirmation existante
    const existingConfirm = document.querySelector('.custom-confirm');
    if (existingConfirm) {
        existingConfirm.remove();
    }

    // Créer la boîte de confirmation
    const confirmDiv = document.createElement('div');
    confirmDiv.className = 'custom-confirm';
    confirmDiv.innerHTML = `
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="confirm-buttons">
            <button class="confirm-btn confirm-yes">✅ Evet</button>
            <button class="confirm-btn confirm-no">❌ Hayır</button>
        </div>
    `;
    document.body.appendChild(confirmDiv);

    // Gestionnaires d'événements
    const yesBtn = confirmDiv.querySelector('.confirm-yes');
    const noBtn = confirmDiv.querySelector('.confirm-no');

    function closeConfirm() {
        confirmDiv.classList.remove('show');
        setTimeout(() => {
            if (confirmDiv && confirmDiv.parentNode) {
                confirmDiv.remove();
            }
        }, 300);
    }

    yesBtn.addEventListener('click', () => {
        closeConfirm();
        if (onYes) onYes();
    });

    noBtn.addEventListener('click', () => {
        closeConfirm();
        if (onNo) onNo();
    });

    // Afficher avec animation
    setTimeout(() => {
        confirmDiv.classList.add('show');
    }, 100);
}

// Fonction pour afficher une notification personnalisée
function showCustomAlert(message, type = 'error', duration = 3000) {
    // Supprimer toute notification existante
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    // Créer la nouvelle notification
    const alertDiv = document.createElement('div');
    alertDiv.className = `custom-alert ${type}`;
    alertDiv.innerHTML = message;
    document.body.appendChild(alertDiv);

    // Afficher avec animation
    setTimeout(() => {
        alertDiv.classList.add('show');
    }, 100);

    // Masquer après le délai
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => {
            if (alertDiv && alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 300);
    }, duration);
}

// Utilitaires de date
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function getWeekEnd(date) {
    const weekStart = getWeekStart(date);
    return new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
}

function getMonthStart(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthEnd(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function getYearStart(date) {
    return new Date(date.getFullYear(), 0, 1);
}

function getYearEnd(date) {
    return new Date(date.getFullYear(), 11, 31);
}

// Initialiser les compteurs - SYSTÈME SIMPLIFIÉ ET FIABLE
function initializeCounters() {
    categories.forEach(cat => {
        if (!counters[cat]) {
            counters[cat] = {};
        }
        if (!counters[cat][currentDate]) {
            counters[cat][currentDate] = 0;
        }
    });
    saveCounters();
}

// Calculer les statistiques pour toutes les périodes à partir des données quotidiennes
function getStatisticsForCategory(category) {
    if (!counters[category]) {
        return { day: 0, week: 0, month: 0, year: 0, total: 0 };
    }

    const today = new Date();
    const todayKey = today.toDateString();

    // Calculer les bornes des périodes
    const weekStart = getWeekStart(today);
    const weekEnd = getWeekEnd(today);
    const monthStart = getMonthStart(today);
    const monthEnd = getMonthEnd(today);
    const yearStart = getYearStart(today);
    const yearEnd = getYearEnd(today);

    let dayCount = counters[category][todayKey] || 0;
    let weekCount = 0;
    let monthCount = 0;
    let yearCount = 0;
    let totalCount = 0;

    // Parcourir tous les jours enregistrés pour cette catégorie
    Object.keys(counters[category]).forEach(dateKey => {
        const date = new Date(dateKey);
        const count = counters[category][dateKey] || 0;

        // Ajouter au total général
        totalCount += count;

        // Vérifier si c'est dans la semaine courante
        if (date >= weekStart && date <= weekEnd) {
            weekCount += count;
        }

        // Vérifier si c'est dans le mois courant
        if (date >= monthStart && date <= monthEnd) {
            monthCount += count;
        }

        // Vérifier si c'est dans l'année courante
        if (date >= yearStart && date <= yearEnd) {
            yearCount += count;
        }
    });

    return {
        day: dayCount,
        week: weekCount,
        month: monthCount,
        year: yearCount,
        total: totalCount
    };
}

// Sauvegardes
function saveCategories() {
    try {
        localStorage.setItem('categories', JSON.stringify(categories));
        localStorage.setItem('lastSave', new Date().toISOString());
        showSaveIndicator();
        updateSaveStatus();
        return true;
    } catch (error) {
        console.error('Erreur sauvegarde catégories:', error);
        return false;
    }
}

function saveCounters() {
    try {
        localStorage.setItem('counters', JSON.stringify(counters));
        localStorage.setItem('lastSave', new Date().toISOString());
        showSaveIndicator();
        updateSaveStatus();
        return true;
    } catch (error) {
        console.error('Erreur sauvegarde compteurs:', error);
        return false;
    }
}

// Indicateur de sauvegarde
function showSaveIndicator() {
    let indicator = document.getElementById('saveIndicator');
    if (!indicator) {
        const div = document.createElement('div');
        div.id = 'saveIndicator';
        div.className = 'save-indicator';
        div.textContent = '✅ Kaydedildi';
        document.body.appendChild(div);
        indicator = div;
    }

    indicator.classList.add('show');
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 2000);
}

function updateSaveStatus() {
    const lastSave = localStorage.getItem('lastSave');
    if (lastSave) {
        const date = new Date(lastSave);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        let timeText = '';
        if (diff < 60) {
            timeText = 'birkaç saniye önce';
        } else if (diff < 3600) {
            timeText = `${Math.floor(diff / 60)} dakika önce`;
        } else {
            timeText = date.toLocaleDateString('tr-TR');
        }

        const lastSaveElement = document.getElementById('lastSave');
        if (lastSaveElement) {
            lastSaveElement.textContent = `Son yedekleme: ${timeText}`;
        }
    }
}

// Changer d'onglet
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }

    // Find and activate the button that was clicked
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach((btn, index) => {
        if ((tabName === 'counter' && index === 0) ||
            (tabName === 'group' && index === 1) ||
            (tabName === 'management' && index === 2) ||
            (tabName === 'stats' && index === 3)) {
            btn.classList.add('active');
        }
    });

    setTimeout(() => {
        if (tabName === 'stats') {
            updateStats();
        } else if (tabName === 'management') {
            updateCategoriesList();
            updateCategorySelect();
        } else if (tabName === 'group') {
            // Reset group interface when switching to group tab
            if (!isHost && connections.size === 0) {
                document.getElementById('hostSection').style.display = 'none';
                document.getElementById('joinSection').style.display = 'none';
                document.getElementById('leaderboard').style.display = 'none';
            }
        }
    }, 100);
}

// Mettre à jour les sélecteurs
function updateCategorySelect() {
    const select = document.getElementById('categorySelect');
    const resetSelect = document.getElementById('categoryToReset');

    // Sélecteur principal
    if (select) {
        select.innerHTML = '<option value="">Kategori seçin</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            select.appendChild(option);
        });
    }

    // Sélecteur pour l'effacement
    if (resetSelect) {
        resetSelect.innerHTML = '<option value="">Kategori seçin</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            resetSelect.appendChild(option);
        });
    }
}

// Mettre à jour la liste des catégories
function updateCategoriesList() {
    const list = document.getElementById('categoriesList');
    if (!list) return;

    list.innerHTML = '';

    categories.forEach((cat, index) => {
        const li = document.createElement('li');
        li.className = 'category-item';

        // Calculer le total pour cette catégorie
        const stats = getStatisticsForCategory(cat);

        li.innerHTML = `
            <div>
                <strong>${cat}</strong>
                <small style="color: #666; display: block;">Toplam: ${stats.total} zikir</small>
            </div>
            <button class="delete-button" onclick="deleteCategory(${index})">Kategoriyi sil</button>
        `;
        list.appendChild(li);
    });
}

// Ajouter une catégorie
function addCategory() {
    const input = document.getElementById('newCategoryInput');
    if (!input) return;

    const newCategory = input.value.trim();

    if (newCategory && !categories.includes(newCategory)) {
        categories.push(newCategory);
        saveCategories();
        initializeCounters();
        updateCategorySelect();
        updateCategoriesList();
        updateStats();
        input.value = '';
        showCustomAlert(`✅ Kategori "${newCategory}" eklendi!`, 'success', 2000);
    } else if (categories.includes(newCategory)) {
        showCustomAlert('⚠️ Bu kategori zaten mevcut!', 'warning', 2500);
    } else {
        showCustomAlert('⚠️ Lütfen bir kategori adı girin!', 'warning', 2500);
    }
}

// Supprimer une catégorie
function deleteCategory(index) {
    const categoryName = categories[index];

    showCustomConfirm(
        '🗑️ Kategoriyi Sil',
        `"${categoryName}" kategorisini silmek istediğinizden emin misiniz?<br><br>⚠️ Bu işlem tüm verilerini de silecektir.`,
        function() {
            // Confirmation "Oui"
            categories.splice(index, 1);
            delete counters[categoryName];
            saveCategories();
            saveCounters();
            updateCategorySelect();
            updateCategoriesList();
            updateStats();

            if (currentCategory === categoryName) {
                currentCategory = '';
                visualOffset = 0;
                const counterDisplay = document.getElementById('counterDisplay');
                const counterLabel = document.getElementById('counterLabel');
                if (counterDisplay) counterDisplay.textContent = '0';
                if (counterLabel) counterLabel.textContent = 'Kategori seçin';
            }

            showCustomAlert(`✅ Kategori "${categoryName}" silindi!`, 'success', 2000);
        }
    );
}

// Mettre à jour l'affichage du compteur
function updateCounterDisplay() {
    const display = document.getElementById('counterDisplay');
    const label = document.getElementById('counterLabel');

    if (!display || !label) return;

    if (currentCategory) {
        const stats = getStatisticsForCategory(currentCategory);
        const visualCount = Math.max(0, stats.day - visualOffset);
        display.textContent = visualCount;
        label.textContent = `${currentCategory} - Bugün`;
    } else {
        display.textContent = '0';
        label.textContent = 'Kategori seçin';
    }
}

// Incrémenter le compteur - VERSION SIMPLE ET FIABLE
function incrementCounter() {
    if (!currentCategory) {
        showCustomAlert('🔔 KATEGORİ SEÇİN!<br><br>Zikir saymaya başlamadan önce lütfen açılır menüden bir kategori seçin.', 'warning', 4000);
        return;
    }

    // Vérifier si on a changé de jour
    const today = new Date().toDateString();
    if (today !== currentDate) {
        currentDate = today;
        initializeCounters();
    }

    // Incrémenter simplement le compteur du jour
    if (!counters[currentCategory][currentDate]) {
        counters[currentCategory][currentDate] = 0;
    }
    counters[currentCategory][currentDate]++;

    if (saveCounters()) {
        updateCounterDisplay();
        updateStats();

        // Animation du bouton
        const button = document.getElementById('countButton');
        if (button) {
            button.style.transform = 'scale(1.1)';
            setTimeout(() => {
                button.style.transform = 'scale(1)';
            }, 150);
        }
    } else {
        // En cas d'erreur de sauvegarde, annuler l'incrémentation
        counters[currentCategory][currentDate]--;
    }
}

// Remettre à zéro SEULEMENT l'affichage visuel (pas les statistiques)
function resetDayCounter() {
    if (!currentCategory) {
        showCustomAlert('🔔 KATEGORİ SEÇİN!<br><br>Lütfen önce bir kategori seçin.', 'warning', 3000);
        return;
    }

    showCustomConfirm(
        '🔄 Görüntü Sıfırlama',
        `"${currentCategory}" için sayaç GÖRÜNTÜSÜNÜ sıfırlayın?<br><br>⚠️ İstatistikler etkilenMEYECEK.`,
        function() {
            // Confirmation "Oui"
            const stats = getStatisticsForCategory(currentCategory);
            visualOffset = stats.day; // L'affichage sera : realCount - realCount = 0
            updateCounterDisplay();
            showCustomAlert('✅ Görüntü sıfırlandı!<br>📊 İstatistikleriniz korundu', 'success', 3000);
        },
        function() {
            // Confirmation "Non" - ne rien faire
            showCustomAlert('❌ Sıfırlama iptal edildi', 'warning', 2000);
        }
    );
}

// FONCTION DE STATISTIQUES - VERSION CORRIGÉE ET FIABLE
function updateStats() {
    try {
        let totalToday = 0;
        let totalWeek = 0;
        let totalMonth = 0;
        let totalYear = 0;
        let totalAll = 0;

        // Calculer les totaux pour toutes les catégories
        categories.forEach(cat => {
            const stats = getStatisticsForCategory(cat);
            totalToday += stats.day;
            totalWeek += stats.week;
            totalMonth += stats.month;
            totalYear += stats.year;
            totalAll += stats.total;
        });

        // Mettre à jour le header
        const todayElement = document.getElementById('totalToday');
        if (todayElement) {
            todayElement.textContent = totalToday;
        }

        // Remplir le tableau
        const tbody = document.querySelector('#completeStatsTable tbody');
        if (tbody) {
            tbody.innerHTML = '';

            categories.forEach(cat => {
                const row = document.createElement('tr');
                const stats = getStatisticsForCategory(cat);

                row.innerHTML = `
                    <td>${cat}</td>
                    <td>${stats.day}</td>
                    <td>${stats.week}</td>
                    <td>${stats.month}</td>
                    <td>${stats.year}</td>
                    <td>${stats.total}</td>
                `;
                tbody.appendChild(row);
            });
        }

        // Mettre à jour les totaux
        const totalElements = {
            'totalDay': totalToday,
            'totalWeek': totalWeek,
            'totalMonth': totalMonth,
            'totalYear': totalYear,
            'totalAll': totalAll
        };

        Object.keys(totalElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = totalElements[id];
            }
        });

        // Résumé
        const summaryElement = document.getElementById('summaryText');
        if (summaryElement) {
            let summary = `📊 Bugün: ${totalToday} zikir`;
            if (totalWeek > totalToday) summary += ` • Bu hafta: ${totalWeek} zikir`;
            if (totalMonth > totalWeek) summary += ` • Bu ay: ${totalMonth} zikir`;
            if (totalYear > totalMonth) summary += ` • Bu yıl: ${totalYear} zikir`;
            summary += ` • Genel toplam: ${totalAll} zikir 🤲`;
            summaryElement.textContent = summary;
        }

    } catch (error) {
        console.error('Erreur statistiques:', error);
    }
}

// Fonctions d'effacement simplifiées et cohérentes
function resetTodayCategory() {
    const category = document.getElementById('categoryToReset').value;
    if (!category) {
        showCustomAlert('🔔 KATEGORİ SEÇİN!<br><br>Silinecek kategoriyi seçin.', 'warning', 3000);
        return;
    }

    showCustomConfirm(
        '🗑️ Bugünü Sil',
        `"${category}" için BUGÜNÜN tüm zikirlerini sil?<br><br>⚠️ Bu işlem istatistikleri etkileyecek!`,
        function() {
            const today = new Date().toDateString();
            if (counters[category] && counters[category][today]) {
                counters[category][today] = 0;
                saveCounters();
                updateCounterDisplay();
                updateStats();
                showCustomAlert('✅ Bugünün zikirleri silindi!', 'success', 2000);
            }
        }
    );
}

function resetWeekCategory() {
    const category = document.getElementById('categoryToReset').value;
    if (!category) {
        showCustomAlert('🔔 KATEGORİ SEÇİN!<br><br>Silinecek kategoriyi seçin.', 'warning', 3000);
        return;
    }

    showCustomConfirm(
        '🗑️ Bu Hafta Sil',
        `"${category}" için BU HAFTANıN tüm zikirlerini sil?<br><br>⚠️ Bu işlem istatistikleri etkileyecek!`,
        function() {
            const today = new Date();
            const weekStart = getWeekStart(today);
            const weekEnd = getWeekEnd(today);

            if (counters[category]) {
                Object.keys(counters[category]).forEach(dateStr => {
                    const date = new Date(dateStr);
                    if (date >= weekStart && date <= weekEnd) {
                        counters[category][dateStr] = 0;
                    }
                });
                saveCounters();
                updateCounterDisplay();
                updateStats();
                showCustomAlert('✅ Bu haftanın zikirleri silindi!', 'success', 2000);
            }
        }
    );
}

function resetMonthCategory() {
    const category = document.getElementById('categoryToReset').value;
    if (!category) {
        showCustomAlert('🔔 KATEGORİ SEÇİN!<br><br>Silinecek kategoriyi seçin.', 'warning', 3000);
        return;
    }

    showCustomConfirm(
        '🗑️ Bu Ayı Sil',
        `"${category}" için BU AYıN tüm zikirlerini sil?<br><br>⚠️ Bu işlem istatistikleri etkileyecek!`,
        function() {
            const today = new Date();
            const monthStart = getMonthStart(today);
            const monthEnd = getMonthEnd(today);

            if (counters[category]) {
                Object.keys(counters[category]).forEach(dateStr => {
                    const date = new Date(dateStr);
                    if (date >= monthStart && date <= monthEnd) {
                        counters[category][dateStr] = 0;
                    }
                });
                saveCounters();
                updateCounterDisplay();
                updateStats();
                showCustomAlert('✅ Bu ayın zikirleri silindi!', 'success', 2000);
            }
        }
    );
}

function resetCategoryCompletely() {
    const category = document.getElementById('categoryToReset').value;
    if (!category) {
        showCustomAlert('🔔 KATEGORİ SEÇİN!<br><br>Silinecek kategoriyi seçin.', 'warning', 3000);
        return;
    }

    showCustomConfirm(
        '⚠️ TEHLİKE - Tamamen Silme',
        `"${category}" kategorisinin tüm geçmişini KALICI olarak sil?<br><br>🔥 Bu işlem GERİ ALINMAZ!`,
        function() {
            showCustomConfirm(
                '🚨 SON ŞANS',
                `GERÇEKTEN emin misiniz?<br><br>💀 "${category}" kategorisinin TÜM geçmişi kaybolacak!`,
                function() {
                    // Réinitialiser complètement la catégorie
                    counters[category] = {};
                    counters[category][currentDate] = 0;

                    saveCounters();
                    updateCounterDisplay();
                    updateStats();
                    showCustomAlert('💥 Geçmiş tamamen silindi!', 'warning', 3000);
                }
            );
        }
    );
}

function resetAllData() {
    showCustomConfirm(
        '🚨 AŞİRİ TEHLİKE',
        'TÜM zikir verilerinizi silin?<br><br>💀 Bu KALICI olarak silecek:<br>• Tüm sayaçlar<br>• Tüm geçmiş<br>• Tüm istatistikler',
        function() {
            showCustomConfirm(
                '💣 SON ŞANS',
                'KESİNLİKLE emin misiniz?<br><br>🔥 Bu işlem GERİ ALINMAZ!',
                function() {
                    // Demander la confirmation par saisie
                    const confirmationDiv = document.createElement('div');
                    confirmationDiv.className = 'custom-confirm';
                    confirmationDiv.innerHTML = `
                        <h3>🔒 Son Onay</h3>
                        <p>Onaylamak için tam olarak <strong>"SİL"</strong> yazın:</p>
                        <input type="text" id="confirmInput" style="padding: 10px; font-size: 16px; margin: 10px 0; text-align: center; border: 2px solid #e53e3e; border-radius: 5px;">
                        <div class="confirm-buttons">
                            <button class="confirm-btn confirm-yes">Onayla</button>
                            <button class="confirm-btn confirm-no">İptal</button>
                        </div>
                    `;
                    document.body.appendChild(confirmationDiv);

                    const input = confirmationDiv.querySelector('#confirmInput');
                    const yesBtn = confirmationDiv.querySelector('.confirm-yes');
                    const noBtn = confirmationDiv.querySelector('.confirm-no');

                    function closeConfirmDiv() {
                        confirmationDiv.remove();
                    }

                    yesBtn.addEventListener('click', () => {
                        if (input.value === 'SİL') {
                            // Réinitialiser toutes les catégories avec le nouveau système
                            const today = new Date();
                            counters = {};
                            categories.forEach(cat => {
                                counters[cat] = {
                                    daily: { [getDayKey(today)]: 0 },
                                    weekly: { [getWeekKey(today)]: 0 },
                                    monthly: { [getMonthKey(today)]: 0 },
                                    yearly: { [getYearKey(today)]: 0 },
                                    total: 0
                                };
                            });

                            saveCounters();
                            updateCounterDisplay();
                            updateStats();
                            closeConfirmDiv();
                            showCustomAlert('💥 TÜM verileriniz silindi!', 'warning', 4000);
                        } else {
                            showCustomAlert('❌ Yanlış metin! Veriler korundu.', 'warning', 3000);
                            closeConfirmDiv();
                        }
                    });

                    noBtn.addEventListener('click', () => {
                        closeConfirmDiv();
                        showCustomAlert('✅ İptal - verileriniz korundu!', 'success', 3000);
                    });

                    setTimeout(() => {
                        confirmationDiv.classList.add('show');
                        input.focus();
                    }, 100);
                }
            );
        }
    );
}

// Export/Import
function exportData() {
    try {
        const exportData = {
            categories: categories,
            counters: counters,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `zikirmatik-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        showCustomAlert('✅ Dışa aktarma başarılı!<br>Dosya başarıyla indirildi', 'success', 3000);
    } catch (error) {
        console.error('Erreur export:', error);
        showCustomAlert('❌ Dışa aktarma hatası', 'error', 3000);
    }
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);

            if (!importedData.categories || !importedData.counters) {
                throw new Error('Geçersiz format');
            }

            showCustomConfirm(
                '📤 Veri İçe Aktar',
                '⚠️ Bu verileri içe aktarmak mevcut TÜM verilerinizi değiştirecek.<br><br>Devam etmek istiyor musunuz?',
                function() {
                    // Confirmation "Oui"
                    categories = importedData.categories;
                    counters = importedData.counters;

                    saveCategories();
                    saveCounters();

                    updateCategorySelect();
                    updateCategoriesList();
                    updateCounterDisplay();
                    updateStats();

                    showCustomAlert('✅ İçe aktarma başarılı!<br>Verileriniz geri yüklendi', 'success', 3000);
                },
                function() {
                    // Confirmation "Non"
                    showCustomAlert('❌ İçe aktarma iptal edildi<br>Mevcut verileriniz korundu', 'warning', 3000);
                }
            );

        } catch (error) {
            console.error('Erreur import:', error);
            showCustomAlert('❌ İçe aktarma hatası<br>Dosyayı kontrol edin', 'error', 3000);
        }
    };
    reader.readAsText(file);
}

// Partage SMS
function shareStatsBySMS() {
    const today = new Date();
    const dateStr = today.toLocaleDateString('tr-TR');
    const todayDateString = today.toDateString();

    let message = `🕌 MANEVİ ZİKİRLERİM - ${dateStr}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    let totalToday = 0;
    let totalGeneral = 0;

    categories.forEach(cat => {
        const todayCount = (counters[cat] && counters[cat][todayDateString]) ? counters[cat][todayDateString] : 0;

        let categoryTotal = 0;
        if (counters[cat]) {
            Object.values(counters[cat]).forEach(count => {
                categoryTotal += count || 0;
            });
        }

        totalToday += todayCount;
        totalGeneral += categoryTotal;

        if (categoryTotal > 0) {
            message += `📿 ${cat}:\n`;
            message += `   Bugün: ${todayCount}\n`;
            message += `   Toplam: ${categoryTotal}\n\n`;
        }
    });

    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `📊 ÖZET:\n`;
    message += `• Bugün: ${totalToday} zikir\n`;
    message += `• GENEL TOPLAM: ${totalGeneral} zikir\n\n`;
    message += `🤲 Allah dualarımızı kabul etsin\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    try {
        // Créer le lien SMS
        const smsLink = `sms:?body=${encodeURIComponent(message)}`;
        const link = document.createElement('a');
        link.href = smsLink;
        link.click();

        // Copier dans le presse-papiers
        navigator.clipboard.writeText(message).then(() => {
            showCustomAlert('📱 SMS açıldı!<br>✅ Mesaj panoya kopyalandı', 'success', 4000);
        }).catch(() => {
            showCustomAlert('📱 SMS uygulaması açıldı!<br>📋 Gerekirse elle kopyalayın', 'success', 4000);
        });

    } catch (error) {
        // En cas d'erreur, juste copier dans le presse-papiers
        navigator.clipboard.writeText(message).then(() => {
            showCustomAlert('📋 Mesaj panoya kopyalandı!<br>SMS uygulamanıza yapıştırın', 'success', 4000);
        }).catch(() => {
            showCustomAlert('❌ SMS açılamadı<br>Elle kopyalamayı deneyin', 'warning', 4000);
        });
    }
}

// Vérification stockage
function checkStorageAvailability() {
    try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (error) {
        return false;
    }
}

// Sauvegarde automatique
function autoSave() {
    if (checkStorageAvailability()) {
        saveCounters();
        saveCategories();
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    try {
        const savedCategories = localStorage.getItem('categories');
        const savedCounters = localStorage.getItem('counters');

        if (savedCategories) {
            categories = JSON.parse(savedCategories);
        }

        if (savedCounters) {
            counters = JSON.parse(savedCounters);
        }
    } catch (error) {
        console.error('Erreur chargement:', error);
    }

    initializeCounters();
    updateCategorySelect();
    updateCategoriesList();
    updateCounterDisplay();
    updateSaveStatus();

    // Événements
    const categorySelect = document.getElementById('categorySelect');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            currentCategory = this.value;
            updateCounterDisplay();
            updateStats();
        });
    }

    const newCategoryInput = document.getElementById('newCategoryInput');
    if (newCategoryInput) {
        newCategoryInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addCategory();
            }
        });
    }

    setTimeout(() => {
        updateStats();
    }, 300);

    if (!localStorage.getItem('hasUsedApp')) {
        localStorage.setItem('hasUsedApp', 'true');
    }
});

// Sauvegardes périodiques
window.addEventListener('beforeunload', autoSave);
window.addEventListener('blur', autoSave);
document.addEventListener('visibilitychange', function() {
    if (document.hidden) autoSave();
});

setInterval(autoSave, 30000);
setInterval(updateSaveStatus, 60000);
setInterval(updateStats, 60000);

// Service Worker pour PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./sw.js')
            .then(function(registration) {
                console.log('Service Worker başarıyla kaydedildi:', registration.scope);

                // Vérifier les mises à jour
                registration.addEventListener('updatefound', function() {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', function() {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Nouvelle version disponible
                            if (confirm('🔄 Yeni sürüm mevcut! Yeniden yükle?')) {
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                                window.location.reload();
                            }
                        }
                    });
                });
            })
            .catch(function(error) {
                console.log('Service Worker hatası:', error);
            });
    });

    // Écouter les changements de Service Worker
    navigator.serviceWorker.addEventListener('controllerchange', function() {
        window.location.reload();
    });
}

// Détection installation PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    deferredPrompt = e;

    // Afficher un bouton d'installation après 3 secondes
    setTimeout(() => {
        if (deferredPrompt && !localStorage.getItem('pwa-dismissed')) {
            showCustomConfirm(
                '📱 Uygulama Kur',
                'Zikirmatik\'i ana ekranınıza kurmak istiyor musunuz?<br><br>✅ Hızlı erişim<br>📱 Çevrim dışı çalışır<br>🔒 Verileriniz gizli kalır',
                function() {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            showCustomAlert('✅ Uygulama kuruldu!', 'success', 3000);
                        } else {
                            localStorage.setItem('pwa-dismissed', 'true');
                        }
                        deferredPrompt = null;
                    });
                },
                function() {
                    localStorage.setItem('pwa-dismissed', 'true');
                }
            );
        }
    }, 3000);
});

// ========================================
// GROUP FUNCTIONALITY - WebRTC P2P System
// ========================================

// Group variables
const MAX_PARTICIPANTS = 39; // Host + 39 participants = 40 total
let peer = null;
let isHost = false;
let groupCode = null;
let connections = new Map(); // Store all peer connections
let participants = new Map(); // Store participant data
let connectionAttempts = 0;
let maxConnectionAttempts = 3;
let groupData = {
    leaderboard: [],
    lastUpdate: Date.now(),
    participantCount: 0
};

// Generate unique group code
function generateGroupCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude confusing chars
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
        if (i === 3) result += '-'; // Format: ABCD-EFGH
    }
    return result;
}

// Start as group host
function startAsHost() {
    // Check if PeerJS is loaded
    if (typeof Peer === 'undefined') {
        showCustomAlert('❌ PeerJS yüklenmedi!<br>Sayfayı yenileyin.', 'error', 3000);
        return;
    }

    if (peer) {
        peer.destroy();
    }

    groupCode = generateGroupCode();
    isHost = true;

    // Initialize PeerJS with the group code as ID
    peer = new Peer(groupCode, {
        debug: 2,
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        }
    });

    peer.on('open', function(id) {
        console.log('Host peer opened with ID:', id);
        showHostInterface();
    });

    peer.on('connection', function(conn) {
        console.log('New participant trying to connect:', conn.peer);

        // Check participant limit
        if (participants.size >= MAX_PARTICIPANTS) {
            console.log('Max participants reached, rejecting connection');
            conn.send({
                type: 'error',
                message: 'Grup dolu! Maksimum 40 kişi katılabilir.'
            });
            conn.close();
            return;
        }

        setupConnection(conn);
    });

    peer.on('error', function(err) {
        console.error('Host peer error:', err);
        showCustomAlert('❌ Grup oluştururken hata!<br>Tekrar deneyin.', 'error', 3000);
    });
}

// Show join form
function showJoinForm() {
    document.getElementById('hostSection').style.display = 'none';
    document.getElementById('joinSection').style.display = 'block';
    document.getElementById('leaderboard').style.display = 'none';
}

// Join existing group
function joinGroup() {
    // Check if PeerJS is loaded
    if (typeof Peer === 'undefined') {
        showCustomAlert('❌ PeerJS yüklenmedi!<br>Sayfayı yenileyin.', 'error', 3000);
        return;
    }

    const code = document.getElementById('joinCodeInput').value.trim().toUpperCase();
    if (!code) {
        showCustomAlert('⚠️ Lütfen grup kodunu girin!', 'warning', 2500);
        return;
    }

    if (peer) {
        peer.destroy();
    }

    groupCode = code;
    isHost = false;

    // Generate unique participant ID
    const participantId = 'user-' + Math.random().toString(36).substr(2, 9);

    peer = new Peer(participantId, {
        debug: 2,
        config: {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        }
    });

    peer.on('open', function(id) {
        console.log('Participant peer opened with ID:', id);
        connectToHost();
    });

    peer.on('error', function(err) {
        console.error('Participant peer error:', err);
        showCustomAlert('❌ Gruba bağlanırken hata!<br>Kod doğru mu?', 'error', 3000);
        showConnectionStatus('Bağlantı hatası', false);
    });
}

// Connect to host
function connectToHost() {
    connectionAttempts++;
    showConnectionStatus(`Gruba bağlanıyor... (${connectionAttempts}/${maxConnectionAttempts})`, false);

    const conn = peer.connect(groupCode, {
        reliable: true
    });

    // Timeout for connection
    const connectionTimeout = setTimeout(() => {
        if (!conn.open) {
            conn.close();
            handleConnectionFailure();
        }
    }, 10000); // 10 second timeout

    conn.on('open', function() {
        console.log('Connected to host');
        clearTimeout(connectionTimeout);
        connectionAttempts = 0; // Reset attempts on success
        setupConnection(conn);

        // Send participant info
        const userName = prompt('👤 Adınızı girin:', 'Katılımcı');
        conn.send({
            type: 'join',
            data: {
                name: userName || 'Anonim',
                id: peer.id,
                stats: getCurrentUserStats()
            }
        });

        showConnectionStatus('✅ Gruba başarıyla bağlandı!', true);
        showLeaderboard();
    });

    conn.on('error', function(err) {
        console.error('Connection error:', err);
        clearTimeout(connectionTimeout);
        handleConnectionFailure();
    });
}

// Handle connection failures with retry
function handleConnectionFailure() {
    if (connectionAttempts < maxConnectionAttempts) {
        showConnectionStatus(`Tekrar deneniyor... (${connectionAttempts}/${maxConnectionAttempts})`, false);
        setTimeout(() => {
            connectToHost();
        }, 3000); // Wait 3 seconds before retry
    } else {
        showCustomAlert('❌ Gruba bağlanılamadı!<br><br>Kontrol edin:<br>• Grup kodu doğru mu?<br>• Koordinatör aktif mi?<br>• İnternet bağlantınız var mı?', 'error', 5000);
        showConnectionStatus('Bağlantı başarısız - Tekrar deneyin', false);
        connectionAttempts = 0;
    }
}

// Setup connection event handlers
function setupConnection(conn) {
    connections.set(conn.peer, conn);

    conn.on('data', function(message) {
        handleMessage(message, conn);
    });

    conn.on('close', function() {
        console.log('Connection closed:', conn.peer);
        connections.delete(conn.peer);
        if (isHost) {
            participants.delete(conn.peer);
            updateParticipantCount();
            broadcastLeaderboard();
        }
    });

    conn.on('error', function(err) {
        console.error('Connection error:', err);
        connections.delete(conn.peer);
    });
}

// Handle incoming messages
function handleMessage(message, conn) {
    switch (message.type) {
        case 'join':
            if (isHost) {
                participants.set(conn.peer, message.data);
                updateParticipantCount();
                broadcastLeaderboard();
                showCustomAlert(`👋 ${message.data.name} gruba katıldı! (${participants.size}/40)`, 'success', 2000);
            }
            break;

        case 'stats_update':
            if (isHost) {
                const participant = participants.get(conn.peer);
                if (participant) {
                    participant.stats = message.data;
                    participant.lastUpdate = Date.now();
                    broadcastLeaderboard();
                }
            }
            break;

        case 'leaderboard':
            if (!isHost) {
                groupData.leaderboard = message.data;
                groupData.participantCount = message.participantCount || 0;
                updateLeaderboardDisplay();
                updateParticipantInfo();
            }
            break;

        case 'error':
            showCustomAlert('❌ ' + message.message, 'error', 4000);
            showConnectionStatus('Grup dolu', false);
            break;
    }
}

// Get current user stats
function getCurrentUserStats() {
    let totalToday = 0;
    let totalWeek = 0;
    let totalAll = 0;

    categories.forEach(cat => {
        const stats = getStatisticsForCategory(cat);
        totalToday += stats.day;
        totalWeek += stats.week;
        totalAll += stats.total;
    });

    return {
        today: totalToday,
        week: totalWeek,
        total: totalAll,
        lastActive: Date.now()
    };
}

// Broadcast leaderboard to all participants
function broadcastLeaderboard() {
    if (!isHost) return;

    const leaderboard = Array.from(participants.entries()).map(([id, data]) => ({
        id: id,
        name: data.name,
        stats: data.stats,
        points: calculatePoints(data.stats),
        lastUpdate: data.lastUpdate || Date.now()
    }));

    // Add host data
    const hostStats = getCurrentUserStats();
    leaderboard.push({
        id: 'host',
        name: '👑 Koordinatör',
        stats: hostStats,
        points: calculatePoints(hostStats),
        lastUpdate: Date.now()
    });

    // Sort by points
    leaderboard.sort((a, b) => b.points - a.points);

    const message = {
        type: 'leaderboard',
        data: leaderboard,
        participantCount: participants.size + 1 // +1 for host
    };

    // Clean up dead connections before broadcasting
    const activeConnections = new Map();
    connections.forEach((conn, id) => {
        if (conn.open) {
            try {
                conn.send(message);
                activeConnections.set(id, conn);
            } catch (error) {
                console.log('Failed to send to:', id);
                conn.close();
            }
        } else {
            participants.delete(id);
        }
    });
    connections = activeConnections;

    // Update host's leaderboard
    groupData.leaderboard = leaderboard;
    groupData.participantCount = participants.size + 1;
    updateLeaderboardDisplay();
    updateParticipantCount();
}

// Calculate points from stats
function calculatePoints(stats) {
    return (stats.today * 10) + (stats.week * 2) + Math.floor(stats.total / 10);
}

// Send stats update to host
function sendStatsUpdate() {
    if (!isHost && connections.size > 0) {
        const stats = getCurrentUserStats();
        const message = {
            type: 'stats_update',
            data: stats
        };

        connections.forEach(conn => {
            if (conn.open) {
                conn.send(message);
            }
        });
    }
}

// UI Functions
function showHostInterface() {
    document.getElementById('hostSection').style.display = 'block';
    document.getElementById('joinSection').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'block';
    document.getElementById('groupCode').textContent = groupCode;

    // Add capacity warning
    const hostSection = document.getElementById('hostSection');
    if (!document.getElementById('capacityWarning')) {
        const warningDiv = document.createElement('div');
        warningDiv.id = 'capacityWarning';
        warningDiv.className = 'backup-info';
        warningDiv.innerHTML = `
            <p>⚠️ Maksimum 40 kişi katılabilir</p>
            <p>📱 Telefonunuz kapalı olursa grup çalışmaz</p>
            <p>🔋 Şarjınızın yeterli olduğundan emin olun</p>
        `;
        hostSection.appendChild(warningDiv);
    }

    updateParticipantCount();
}

function showLeaderboard() {
    document.getElementById('hostSection').style.display = 'none';
    document.getElementById('joinSection').style.display = 'none';
    document.getElementById('leaderboard').style.display = 'block';
}

function updateParticipantCount() {
    const count = participants.size;
    const element = document.getElementById('participantCount');
    if (element) {
        element.textContent = count;

        // Color coding based on capacity
        const parentElement = element.parentElement;
        if (count >= 35) {
            parentElement.style.color = '#e53e3e'; // Red when near capacity
        } else if (count >= 25) {
            parentElement.style.color = '#ed8936'; // Orange
        } else {
            parentElement.style.color = '#2c7a7b'; // Default teal
        }
    }
}

// Update participant info for non-hosts
function updateParticipantInfo() {
    if (!isHost && groupData.participantCount) {
        const statusElement = document.querySelector('#leaderboard .stats-section');
        if (statusElement && !document.getElementById('participantInfo')) {
            const infoDiv = document.createElement('div');
            infoDiv.id = 'participantInfo';
            infoDiv.className = 'group-status';
            infoDiv.innerHTML = `<h4>Toplam Katılımcı: <span id="totalParticipants">${groupData.participantCount}</span>/40</h4>`;
            statusElement.insertBefore(infoDiv, statusElement.firstChild);
        } else if (document.getElementById('totalParticipants')) {
            document.getElementById('totalParticipants').textContent = groupData.participantCount;
        }
    }
}

function showConnectionStatus(text, isConnected) {
    const statusDiv = document.getElementById('connectionStatus');
    const statusText = document.getElementById('statusText');

    statusDiv.style.display = 'block';
    statusText.textContent = text;

    if (isConnected) {
        statusDiv.className = 'connection-status connected';
    } else {
        statusDiv.className = 'connection-status';
    }
}

// Update leaderboard display
function updateLeaderboardDisplay() {
    const container = document.getElementById('leaderboardList');
    container.innerHTML = '';

    if (groupData.leaderboard.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Henüz katılımcı yok</p>';
        return;
    }

    groupData.leaderboard.forEach((participant, index) => {
        const item = document.createElement('div');
        item.className = 'leaderboard-item';

        let positionClass = 'other';
        let positionIcon = index + 1;

        if (index === 0) { positionClass = 'first'; positionIcon = '🥇'; }
        else if (index === 1) { positionClass = 'second'; positionIcon = '🥈'; }
        else if (index === 2) { positionClass = 'third'; positionIcon = '🥉'; }

        item.innerHTML = `
            <div class="leaderboard-position ${positionClass}">${positionIcon}</div>
            <div class="leaderboard-info">
                <div class="leaderboard-name">${participant.name}</div>
                <div class="leaderboard-details">Bugün: ${participant.stats.today} • Hafta: ${participant.stats.week}</div>
            </div>
            <div class="leaderboard-score">
                <div class="leaderboard-points">${participant.points} puan</div>
                <div class="leaderboard-today">+${participant.stats.today * 10} bugün</div>
            </div>
        `;

        container.appendChild(item);
    });
}

// Share group code
function shareGroupCode() {
    const message = `🕌 Zikirmatik Grup Yarışmasına katıl!\n\nGrup Kodu: ${groupCode}\n\nBağlantı: ${window.location.href}\n\n📱 Kodu uygulamaya gir ve gruba katıl!`;

    if (navigator.share) {
        navigator.share({
            title: 'Zikirmatik Grup Kodu',
            text: message
        }).catch(console.error);
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(message).then(() => {
            showCustomAlert('📋 Grup kodu panoya kopyalandı!<br>WhatsApp\'ta paylaşabilirsiniz', 'success', 4000);
        }).catch(() => {
            showCustomAlert('❌ Kopyalama hatası<br>Elle kopyalayın: ' + groupCode, 'warning', 4000);
        });
    }
}

// Leave group
function leaveGroup() {
    showCustomConfirm(
        '🚪 Gruptan Ayrıl',
        'Gruptan ayrılmak istediğinizden emin misiniz?',
        function() {
            if (peer) {
                peer.destroy();
            }
            connections.clear();
            participants.clear();
            groupData.leaderboard = [];

            document.getElementById('hostSection').style.display = 'none';
            document.getElementById('joinSection').style.display = 'none';
            document.getElementById('leaderboard').style.display = 'none';

            showCustomAlert('👋 Gruptan ayrıldınız', 'success', 2000);
        }
    );
}

// Override incrementCounter to send updates
const originalIncrementCounter = incrementCounter;
incrementCounter = function() {
    originalIncrementCounter();
    // Send update to group after a small delay
    setTimeout(sendStatsUpdate, 500);
};

// Auto-refresh and cleanup
setInterval(() => {
    if (isHost && participants.size > 0) {
        // Clean up inactive participants (no update for 5 minutes)
        const now = Date.now();
        const inactiveThreshold = 5 * 60 * 1000; // 5 minutes

        participants.forEach((participant, id) => {
            if (now - (participant.lastUpdate || now) > inactiveThreshold) {
                console.log('Removing inactive participant:', id);
                participants.delete(id);
                const conn = connections.get(id);
                if (conn) {
                    conn.close();
                    connections.delete(id);
                }
            }
        });

        broadcastLeaderboard();
    }
}, 30000); // Every 30 seconds

// Connection health check
setInterval(() => {
    if (isHost) {
        connections.forEach((conn, id) => {
            if (!conn.open) {
                connections.delete(id);
                participants.delete(id);
            }
        });
    }
}, 10000); // Every 10 seconds