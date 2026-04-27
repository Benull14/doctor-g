type DoctorSearchProps = {
  nameFilter: string;
  specialtyFilter: string;
  cityFilter: string;
  onNameChange: (value: string) => void;
  onSpecialtyChange: (value: string) => void;
  onCityChange: (value: string) => void;
};

export default function DoctorSearch({
  nameFilter,
  specialtyFilter,
  cityFilter,
  onNameChange,
  onSpecialtyChange,
  onCityChange
}: DoctorSearchProps) {
  return (
    <section className="search-panel">
      <h2>ابحث عن طبيب</h2>
      <div className="search-grid">
        <label>
          اسم الطبيب
          <input
            value={nameFilter}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="ابحث باسم الطبيب"
          />
        </label>
        <label>
          الاختصاص
          <input
            value={specialtyFilter}
            onChange={(e) => onSpecialtyChange(e.target.value)}
            placeholder="ابحث حسب الاختصاص"
          />
        </label>
        <label>
          المدينة
          <input
            value={cityFilter}
            onChange={(e) => onCityChange(e.target.value)}
            placeholder="ابحث حسب المدينة"
          />
        </label>
      </div>
    </section>
  );
}
